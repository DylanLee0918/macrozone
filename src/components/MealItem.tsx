import { deleteMeal } from "@/storage/meals";
import { colors } from "@/styles/global";
import * as Haptics from "expo-haptics";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type MealItemProps = {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    onDelete: () => void;
};

const MACRO_BADGES = [
    { key: "calories", label: "calorie", color: "#ff6b6b", bg: "#ff6b6b22" },
    { key: "protein", label: "Protein", color: "#4ecdc4", bg: "#4ecdc422" },
    { key: "carbs", label: "Carbs", color: "#ffd93d", bg: "#ffd93d22" },
    { key: "fat", label: "Fats", color: "#6bcb77", bg: "#6bcb7722" },
] as const;

type MacroBadgeProps = {
    value: number;
    label: string;
    color: string;
    bg: string;
};

function MacroBadge({ value, label, color, bg }: MacroBadgeProps) {
    return (
        <View style={[styles.badge, { backgroundColor: bg }]}>
            <Text style={[styles.badgeText, { color }]}>
                {value}
                {label === "calorie" ? "" : "g"} {label}
            </Text>
        </View>
    );
}

export default function MealItem({
    id,
    name,
    calories,
    protein,
    carbs,
    fat,
    onDelete,
}: MealItemProps) {
    const macroValues = { calories, protein, carbs, fat };

    const handleLongPress = () => {
        Alert.alert(
            "Delete Meal",
            `Are you sure you want to delete "${name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteMeal(id);
                        Haptics.notificationAsync(
                            Haptics.NotificationFeedbackType.Success,
                        );
                        onDelete();
                    },
                },
            ],
        );
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onLongPress={handleLongPress}
        >
            <Text style={styles.name}>{name}</Text>
            <View style={styles.badgeRow}>
                {MACRO_BADGES.map(({ key, label, color, bg }) => (
                    <MacroBadge
                        key={key}
                        value={macroValues[key]}
                        label={label}
                        color={color}
                        bg={bg}
                    />
                ))}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 10,
    },
    badgeRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    badge: {
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600",
    },
});
