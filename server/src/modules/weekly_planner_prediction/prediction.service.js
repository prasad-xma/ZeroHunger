exports.predictMonthlyWeight = (history) => {
    // Use last 2 weeks for simple linear prediction
    const n = history.length;
    if (n < 2) return null;

    const last = history[n-1].weight;
    const prev = history[n-2].weight;
    const delta = last - prev;

    return (last + delta * 4).toFixed(2); // next month estimate
};

exports.deleteProgress = async (progressId) => {
    const Progress = require('./progress.model');
    const progress = await Progress.findByIdAndDelete(progressId);
    if (!progress) throw new Error("Progress record not found");
    return progress;
};

exports.deleteAllUserProgress = async (userId) => {
    const Progress = require('./progress.model');
    const result = await Progress.deleteMany({ userId });
    return { deletedCount: result.deletedCount };
};