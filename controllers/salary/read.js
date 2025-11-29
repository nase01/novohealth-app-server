const Sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize');
const literal = Sequelize.literal
const { Salary,  Admin } = require('../../models/sequelize')
const moment = require('moment');

const salaryModelAssociates = () => {
  return [{
    model: Admin, 
    attributes: ['name'], 
    as: 'admin' 
  }
]
}

const salarySearchFilterGenerator = (query) => {
  try {
    const salarySearchFilters = []
		
		if(query.adminId) {
			salarySearchFilters.push({
				adminId: query.adminId
			})
		}

		if (query.storeId) {
      salarySearchFilters.push({ storeId: query.storeId })
    }

		if (query.startDate && query.endDate) {
      salarySearchFilters.push({
        payDate: {
          [Op.and]: {
            [Op.gte]: query.startDate,
            [Op.lte]: `${query.endDate} 23:59:59.999`
          }
        }
      })
    }

    return salarySearchFilters.length === 0 ? {} : salarySearchFilters
  } catch (error) {
    throw new Error(error)
  }
}

const salaryDataFormatter = (data) => {
  if (!data) {
    return []
  }

  const formatData = (data) => {
    const { admin, compBaseSalary, compWorkDays, compBrokenDays, compOvertime, compOthers, dedLate, dedUndertime, shortCashier, shortGCash, shortPayMaya, shortInventory, shortCashAdvance, shortPurchased, shortOthers, govtSSS, govtPhilhealth, govtPagIbig, ...newData } = data.toJSON();

    return {
      ...newData,
			employee: admin ? admin.name : null,
      compensations: {
        compBaseSalary,
        compWorkDays,
				compWorkDaysAmount: parseFloat((compWorkDays * compBaseSalary ).toFixed(2)),
        compBrokenDays,
				compBrokenDaysAmount: parseFloat((compBrokenDays * 20).toFixed(2)),
        compOvertime,
				compOverTimeAmount: parseFloat(((compBaseSalary / 540) * compOvertime).toFixed(2)),
        compOthers,
				compOthersAmount: parseFloat((compOthers).toFixed(2)),
      },
      deductions: {
        dedLate,
				dedLateAmount: parseFloat(((compBaseSalary / 540) * dedLate).toFixed(2)),
        dedUndertime,
				dedUndertimeAmount: parseFloat(((compBaseSalary / 540) * dedUndertime).toFixed(2)),
        shortCashier,
        shortGCash,
        shortPayMaya,
        shortInventory,
        shortCashAdvance,
        shortPurchased,
        shortOthers,
        govtSSS,
				govtSSSAmount: parseFloat(govtSSS.toFixed(2)),
        govtPhilhealth,
        govtPagIbig,
      }
    };
  };

  return Array.isArray(data) ? data.map(formatData) : formatData(data);
}

const salaryCount = async (req, res) => {
  try {
    const find = salarySearchFilterGenerator(req.query)
    const count = await Salary.count({
      where: find
    })

    return res.status(200).json({ data: { count } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

const salaryFetch = async (req, res) => {
  const associates = salaryModelAssociates()

  try {
    const salary = await Salary.findOne({
      include: associates,
      where: { id: req.params.id },
      attributes: { 
        exclude: ['version', 'createdAt', 'updatedAt', 'payDate', 'payFrom', 'payTo', 'AdminId'],
        include: [
          [literal("DATE_FORMAT(payDate, '%Y-%m-%d')"), 'payDate'],
          [literal("DATE_FORMAT(payFrom, '%Y-%m-%d')"), 'payFrom'],
          [literal("DATE_FORMAT(payTo, '%Y-%m-%d')"), 'payTo']
        ]
      }
    })
    const data = salaryDataFormatter(salary) || []

    return res.status(200).json({ data })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

const salaryFetchMany = async (req, res) => {
  try {
    
    const find = salarySearchFilterGenerator(req.query)
    const associates = salaryModelAssociates()
    const sort = ['payDate', 'ASC']

    const perPage = +req.query.perPage
    const currentPage = +req.query.currentPage

    const skip = currentPage && perPage ? (currentPage - 1) * perPage : 0
    const limit = currentPage && perPage ? perPage : 0

    const salary = await Salary.findAll({
      include: associates,
      where: find,
      attributes: {
        exclude: ['version', 'createdAt', 'updatedAt', 'payDate', 'payFrom', 'payTo', 'AdminId'],
        include: [
          [literal("DATE_FORMAT(payDate, '%Y-%m-%d')"), 'payDate'],
          [literal("DATE_FORMAT(payFrom, '%Y-%m-%d')"), 'payFrom'],
          [literal("DATE_FORMAT(payTo, '%Y-%m-%d')"), 'payTo']
        ]
      },
      order: [sort],
      offset: skip,
      limit
    })

    const data = salaryDataFormatter(salary)

    return res.status(200).json({ data })
  } catch (error) {
		console.log(error)
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

const salary13thMonth = async (req, res) => {
  try {
    const find = salarySearchFilterGenerator(req.query);
    const associates = salaryModelAssociates();

    const salaryRecords = await Salary.findAll({
      include: associates,
      where: find,
      attributes: [
        'adminId',
        'compBaseSalary',
        'compWorkDays',
        'dedLate',
        'dedUndertime',
        'payFrom',
        'payTo',
        [literal("DATE_FORMAT(payDate, '%Y-%m')"), 'month']
      ],
      order: [
        [{ model: Admin, as: 'admin' }, 'name', 'ASC'],
        [literal("DATE_FORMAT(payDate, '%Y-%m')"), 'ASC']
      ]
    });

    const grouped = {};

    salaryRecords.forEach(record => {
      const r = record.toJSON();
      const employee = r.admin ? r.admin.name : "Unknown";
      const month = r.month;
      const key = `${r.adminId}-${month}`;

      const isDecember = month === "2025-12";
      const hourlyRate = r.compBaseSalary / 540;

      // BASE VALUES
      let compWorkDays = r.compWorkDays;
      let dedLate = r.dedLate;
      let dedUndertime = r.dedUndertime;

      if (isDecember) {
        // (1) FIX WORKDAYS TO 28
        compWorkDays = 28;

        // (2) Include deductions ONLY from Dec 1–15
        const payFrom = new Date(r.payFrom);
        const payTo = new Date(r.payTo);
        const dec15 = new Date("2025-12-15T23:59:59");

        const isFirstHalf = payFrom <= dec15 && payTo <= dec15;

        if (!isFirstHalf) {
          // Dec 16–31 deduction is NOT counted
          dedLate = 0;
          dedUndertime = 0;
        }
      }

      // ---- ALL CALCULATIONS BELOW USE THE VALUES ABOVE ----

      const compWorkDaysAmount = parseFloat(
        (r.compBaseSalary * compWorkDays).toFixed(2)
      );

      const dedLateAmount = parseFloat((hourlyRate * dedLate).toFixed(2));

      const dedUndertimeAmount = parseFloat(
        (hourlyRate * dedUndertime).toFixed(2)
      );

      const totalWorkDays = parseFloat(
        (compWorkDaysAmount - dedLateAmount - dedUndertimeAmount).toFixed(2)
      );

      // ---- GROUPING LOGIC (unchanged) ----
      if (!grouped[key]) {
        grouped[key] = {
          adminId: r.adminId,
          employee,
          month,
          compBaseSalary: r.compBaseSalary,

          compWorkDays: 0,
          compWorkDaysAmount: 0,

          dedLate: 0,
          dedLateAmount: 0,

          dedUndertime: 0,
          dedUndertimeAmount: 0,

          totalWorkDays: 0,
        };
      }

      grouped[key].compWorkDays += compWorkDays;
      grouped[key].compWorkDaysAmount += compWorkDaysAmount;

      grouped[key].dedLate += dedLate;
      grouped[key].dedLateAmount += dedLateAmount;

      grouped[key].dedUndertime += dedUndertime;
      grouped[key].dedUndertimeAmount += dedUndertimeAmount;

      grouped[key].totalWorkDays += totalWorkDays;
    });

    // Convert grouped object → array of results
    const result = Object.values(grouped).map(item => ({
      ...item,
      compWorkDaysAmount: parseFloat(item.compWorkDaysAmount.toFixed(2)),
      dedLateAmount: parseFloat(item.dedLateAmount.toFixed(2)),
      dedUndertimeAmount: parseFloat(item.dedUndertimeAmount.toFixed(2)),
      totalWorkDays: parseFloat(item.totalWorkDays.toFixed(2))
    }));

    // Sort by employee, then month
    result.sort((a, b) => {
      const empCompare = a.employee.localeCompare(b.employee);
      if (empCompare !== 0) return empCompare;
      return a.month.localeCompare(b.month);
    });

    // SUMMARY CALCULATION
    const subTotal = result.reduce((sum, row) => sum + row.totalWorkDays, 0);
    const total13MonthPay = parseFloat((subTotal / 12).toFixed(2));

    const summary = {
      subTotal: parseFloat(subTotal.toFixed(2)),
      total13MonthPay
    };

    return res.status(200).json({
      data: result,
      summary
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: [{ status: "500", detail: "Internal Server Error" }]
    });
  }
};

module.exports = {
	salaryCount,
	salaryFetch,
  salaryFetchMany,
  salary13thMonth
}
