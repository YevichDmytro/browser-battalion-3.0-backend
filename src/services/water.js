import UsersCollection from '../db/models/Users.js';
import WaterTrackerCollection from '../db/models/WaterTracker.js';
import formatDateTime from '../utils/formatDate.js';

export const addWaterDataService = async (payload) => {
  const water = await WaterTrackerCollection.create(payload);
  return water;
};

export const editWaterService = async (id, payload, userId) => {
  const water = await WaterTrackerCollection.findByIdAndUpdate(
    { _id: id, userId },
    payload,
    { new: true },
  );
  return water;
};

export const deleteWaterService = async (id) => {
  const waterRecord = await WaterTrackerCollection.findOneAndDelete({
    _id: id,
  });

  return waterRecord;
};

export const getAllRecords = () => WaterTrackerCollection.find();

export const getWaterTodayService = async (userId) => {
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const dailyNorma = user.waterRate;

  const currentDate = new Date();
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

  const startOfDayString = formatDateTime(startOfDay);
  const endOfDayString = formatDateTime(endOfDay);

  const waterRecords = await WaterTrackerCollection.find({
    userId,
    dateTime: {
      $gte: startOfDayString,
      $lte: endOfDayString,
    },
  });

  const totalWaterConsumed = waterRecords.reduce(
    (total, record) => total + record.value,
    0,
  );

  const percentageOfGoal = (totalWaterConsumed / dailyNorma) * 100;

  return {
    records: waterRecords,
    percentageOfGoal: Math.min(percentageOfGoal, 100),
  };
};

export const getWaterByDateService = async (userId, date) => {
  const startOfDay = `${date} 00:00:00`;
  const endOfDay = `${date} 23:59:59`;

  const water = await WaterTrackerCollection.find({
    userId,
    dateTime: { $gte: startOfDay, $lte: endOfDay },
  });

  return water;
};

export const getWaterByMonthService = async (userId, month, year) => {
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const dailyNorma = user.waterRate;

  const monthString = String(month).padStart(2, '0');
  const startOfMonth = `01-${monthString}-${year}`;
  const endOfMonth = `${new Date(
    year,
    month,
    0,
  ).getDate()}-${monthString}-${year}`;

  const waterRecords = await WaterTrackerCollection.find({
    userId,
    dateTime: {
      $gte: startOfMonth,
      $lte: `${endOfMonth} 23:59:59`,
    },
  });

  const dailyConsumption = {};

  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDate = `${String(day).padStart(
      2,
      '0',
    )}-${monthString}-${year}`;
    dailyConsumption[formattedDate] = {
      totalWater: 0,
      count: 0,
    };
  }

  waterRecords.forEach((record) => {
    const [datePart] = record.dateTime.split(' ');
    const formattedDate = datePart.trim();

    if (dailyConsumption[formattedDate]) {
      dailyConsumption[formattedDate].totalWater += record.value || 0;
      dailyConsumption[formattedDate].count += 1;
    }
  });

  return Object.entries(dailyConsumption).map(
    ([date, { totalWater, count }]) => {
      const goalPercentage = (totalWater / dailyNorma) * 100;

      return {
        date,
        dailyNorma: `${dailyNorma} L`,
        goalPercentage: Math.min(goalPercentage, 100),
        consumptionCount: count,
        value: totalWater,
      };
    },
  );
};
