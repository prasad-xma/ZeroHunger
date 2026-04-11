exports.predictMonthlyWeight = (history) => {
    // Use last 2 weeks for simple linear prediction
    const n = history.length;
    if (n < 2) return null;

    const last = history[n-1].weight;
    const prev = history[n-2].weight;
    const delta = last - prev;

    return (last + delta * 4).toFixed(2); // next month estimate
};

exports.deleteProgress = async (id) => {
    const Progress = require('./progress.model');
    const deletedProgress = await Progress.findByIdAndDelete(id);
    return deletedProgress;
};

exports.deleteAllUserProgress = async () => {
    const Progress = require('./progress.model');
    const result = await Progress.deleteMany();
    return { deletedCount: result.deletedCount };
};