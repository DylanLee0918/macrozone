import Constants from "expo-constants";

const isExpoGo = Constants.executionEnvironment === "storeClient";

export const requestPermissions = async (): Promise<boolean> => {
    console.log(isExpoGo);
    if (isExpoGo) return true;
    const Notifications = await import("expo-notifications");
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
};

export const scheduleMealReminders = async () => {
    if (isExpoGo) return;
    const Notifications = await import("expo-notifications");
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "MacroZone",
            body: "Don't forget to log your lunch!",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 12,
            minute: 0,
        },
    });
    await Notifications.scheduleNotificationAsync({
        content: { title: "MacroZone", body: "Time to log your dinner!" },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 18,
            minute: 0,
        },
    });
};

export const cancelMealReminders = async () => {
    if (isExpoGo) return;
    const Notifications = await import("expo-notifications");
    await Notifications.cancelAllScheduledNotificationsAsync();
};
