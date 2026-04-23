import AdBanner from "@/components/Banner";
import { Colors, gradients } from "@/constants/theme";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useStore } from "@/src/store/useStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type availableColors =
  | "blue"
  | "green"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "teal"
  | "yellow";

const checkIcon = () => (
  <View
    style={{
      position: "absolute",
      top: 5,
      right: 5,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Ionicons name="checkmark-circle-outline" size={20} color={"#333"} />
  </View>
);

interface CreateCategoryScreenProps {
  onCategoryCreated?: (id: string) => void;
  showAdd?: boolean;
  onClose?: () => void;
  showClsoeButton?: boolean;
}

export default function CreateCategoryScreen({
  onCategoryCreated,
  showAdd = true,
  onClose,
  showClsoeButton = false,
}: CreateCategoryScreenProps) {
  const router = useRouter();
  const colors = Colors[useColorScheme()];
  const { t: t } = useTranslation("categories");
  const { t: tcom } = useTranslation("common");

  const { addCategory } = useStore();

  const [form, setForm] = useState<{ name: string; color: availableColors }>({
    name: "",
    color: "blue",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCategory = async () => {
    if (!form.name.trim()) return;

    setIsSaving(true);

    let newCategoryId = Date.now().toString();

    await addCategory({
      id: newCategoryId,
      name: form.name.trim(),
      parentId: null,
      createdAt: Date.now(),
      color: form.color,
    });
    setForm({ name: "", color: "blue" });
    setIsSaving(false);
    if (onCategoryCreated) {
      onCategoryCreated(newCategoryId);
      return;
    }
    router.replace("/");
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: colors.card,
            paddingTop: 25,
            minHeight: "13%",
            paddingHorizontal: 20,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
          className="shadow-md"
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  color: colors.text,
                }}
              >
                {t("addCategory")}
              </Text>
            </View>
          </View>

          {showClsoeButton && (
            <TouchableOpacity
              onPress={() => {
                if (onClose) {
                  onClose();
                  return;
                }
              }}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

        {/* Form */}

        <View
          className="shadow-md mt-6"
          style={{
            backgroundColor: colors.card,
            padding: 20,
            marginHorizontal: 20,
            borderRadius: 10,
          }}
        >
          <View>
            <Text className=" mb-2 text-xl" style={{ color: colors.text }}>
              {t("categoryName")}
            </Text>

            <TextInput
              placeholder={t("categoryName")}
              style={{
                backgroundColor: colors.background,
                borderRadius: 8,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 16,
                color: colors.text,
              }}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
          </View>

          <View className="mt-6">
            <Text className="mb-2 text-xl" style={{ color: colors.text }}>
              {t("colorSelector")}
            </Text>
          </View>

          <View className="mt-6" style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={{
                height: 80,
                flex: 1,
                borderRadius: 10,
                experimental_backgroundImage: gradients.blue,
              }}
              onPress={() => setForm({ ...form, color: "blue" })}
            >
              {form.color === "blue" && checkIcon()}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 80,
                flex: 1,
                borderRadius: 10,
                experimental_backgroundImage: gradients.green,
              }}
              onPress={() => setForm({ ...form, color: "green" })}
            >
              {form.color === "green" && checkIcon()}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 80,
                flex: 1,
                borderRadius: 10,
                experimental_backgroundImage: gradients.orange,
              }}
              onPress={() => setForm({ ...form, color: "orange" })}
            >
              {form.color === "orange" && checkIcon()}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 80,
                flex: 1,
                borderRadius: 10,
                experimental_backgroundImage: gradients.pink,
              }}
              onPress={() => setForm({ ...form, color: "pink" })}
            >
              {form.color === "pink" && checkIcon()}
            </TouchableOpacity>
          </View>

          <View className="mt-4" style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={{
                height: 80,
                flex: 1,
                borderRadius: 10,
                experimental_backgroundImage: gradients.purple,
              }}
              onPress={() => setForm({ ...form, color: "purple" })}
            >
              {form.color === "purple" && checkIcon()}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 80,
                flex: 1,
                borderRadius: 10,
                experimental_backgroundImage: gradients.red,
              }}
              onPress={() => setForm({ ...form, color: "red" })}
            >
              {form.color === "red" && checkIcon()}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 80,
                flex: 1,
                borderRadius: 10,
                experimental_backgroundImage: gradients.teal,
              }}
              onPress={() => setForm({ ...form, color: "teal" })}
            >
              {form.color === "teal" && checkIcon()}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 80,
                flex: 1,
                borderRadius: 10,
                experimental_backgroundImage: gradients.yellow,
              }}
              onPress={() => setForm({ ...form, color: "yellow" })}
            >
              {form.color === "yellow" && checkIcon()}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className=" py-4 rounded-xl items-center mt-10"
            style={{
              experimental_backgroundImage: gradients.blue,
            }}
            onPress={handleSaveCategory}
          >
            <Text className="font-semibold text-lg" style={{ color: "white" }}>
              {t("saveCategory")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
      </View>
      {showAdd && <AdBanner />}
    </>
  );
}
