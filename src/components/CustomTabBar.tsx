// components/CustomTabBar.tsx
import { colors } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Tabs that live inside the pill (in order)
const PILL_ROUTES = ["index", "meals"];

const PILL_CONFIG: Record<
    string,
    { label: string; icon: string; iconActive: string }
> = {
    index: { label: "Home", icon: "home-outline", iconActive: "home" },
    meals: { label: "All Meals", icon: "list-outline", iconActive: "list" },
};

export default function CustomTabBar({
    state,
    descriptors,
    navigation,
}: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    console.log(state.routes);
    const pillRoutes = state.routes.filter((r) => PILL_ROUTES.includes(r.name));
    const fabRoute = state.routes.find((r) => r.name === "add-meal");

    const isActive = (routeName: string) =>
        state.routes[state.index].name === routeName;

    const navigate = (routeName: string) => {
        const event = navigation.emit({
            type: "tabPress",
            target: state.routes.find((r) => r.name === routeName)?.key ?? "",
            canPreventDefault: true,
        });
        if (!event.defaultPrevented) {
            navigation.navigate(routeName);
        }
    };

    return (
        <View style={[styles.root, { paddingBottom: insets.bottom || 16 }]}>
            {/* ── Pill ── */}
            <View style={styles.pill}>
                {pillRoutes.map((route) => {
                    const active = isActive(route.name);
                    const cfg = PILL_CONFIG[route.name];
                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={[
                                styles.tabItem,
                                active && styles.tabItemActive,
                            ]}
                            onPress={() => navigate(route.name)}
                            activeOpacity={0.75}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: active }}
                            accessibilityLabel={cfg.label}
                        >
                            <Ionicons
                                name={
                                    (active ? cfg.iconActive : cfg.icon) as any
                                }
                                size={22}
                                color={
                                    active
                                        ? colors.primary
                                        : colors.textSecondary
                                }
                            />
                            <Text
                                style={[
                                    styles.label,
                                    active && styles.labelActive,
                                ]}
                            >
                                {cfg.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* ── FAB (Add Meal) ── */}
            {fabRoute && (
                <View style={styles.fabColumn}>
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={() => navigate(fabRoute.name)}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel="Add Meal"
                    >
                        <Ionicons name="add" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const FAB_SIZE = 72;

const styles = StyleSheet.create({
    root: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingHorizontal: 16,
        paddingTop: 10,
        backgroundColor: colors.background,
        gap: 14,
    },

    // ── Pill ──
    pill: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 999,
        height: 74,
        paddingHorizontal: 6,
        marginBottom: 10,
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        borderRadius: 999,
        gap: 4,
    },
    tabItemActive: {
        // Slightly lighter surface to highlight active tab
        backgroundColor: colors.background,
    },
    label: {
        fontSize: 11,
        fontWeight: "500",
        color: colors.textSecondary,
    },
    labelActive: {
        color: colors.primary,
        fontWeight: "700",
    },

    // ── FAB ──
    fabColumn: {
        alignItems: "center",
        gap: 4,
        paddingBottom: 2,
    },
    fabHint: {
        fontSize: 11,
        fontWeight: "700",
    },
    fab: {
        width: FAB_SIZE,
        height: FAB_SIZE,
        borderRadius: 24,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        ...Platform.select({
            ios: {
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.45,
                shadowRadius: 8,
            },
        }),
    },
});
