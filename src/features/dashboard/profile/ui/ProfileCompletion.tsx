import {
    Avatar,
    Button,
    Center,
    FileButton,
    Grid,
    Group,
    Select,
    Stack,
    Text,
    Textarea,
    TextInput,
    UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { useAuth } from "../../../auth/context/FirebaseAuthContext";
import {
    CountrySelector,
    usePhoneInput
} from "react-international-phone";
import "react-international-phone/style.css";
import { useNavigate } from "react-router-dom";
import { storage } from "../../../../config/firebase";
import { IAuthUser } from "../../../auth/types";
import { useCountriesAndCurrencies } from "../data";
import { useProfileServices } from "../services";
import { ProfileForm } from "../types";

export default function ProfileCompletion() {
    const navigate = useNavigate();
    const { user: authUser, signIn: updateAuthUser } = useAuth();
    const { countries, getCurrencyForCountry } = useCountriesAndCurrencies();

    const { createUserData, initializeNotificationToken } = useProfileServices();
    const [activeStep, setActiveStep] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Initialize notification token when component mounts
    useEffect(() => {
        initializeNotificationToken();
    }, [authUser?.uid]);
    
    const form = useForm<ProfileForm>({
        initialValues: {
            fullName: authUser?.fullName || "",
            gender: "",
            userType: "",
            ageGroup: "",
            phoneCountryCode: "",
            phoneNumber: "",
            country: null,
            currency: null,
            bio: "",
            avatarURL: authUser?.avatarURL,
        },

        validate: (values) => {
            if (activeStep === 0) {
                return {
                    fullName:
                        values.fullName.trim().length == 0 ? "Full name required" : null,
                    userType:
                        values.userType.trim().length == 0 ? "User type required" : null,
                };
            }
            if (activeStep === 1) {
                return {
                    phoneNumber:
                        values.phoneNumber.trim().length == 0
                            ? "Phone number required"
                            : null,
                    country:
                        values.country == null || values.country == undefined
                            ? "Country required"
                            : null,
                };
            }
            return {};
        },
    });

    const phoneInput = usePhoneInput({
        defaultCountry: "tz",
        value: form.values.phoneCountryCode,
        onChange: (data) => {
            form.setFieldValue("phoneCountryCode", data.phone);
        },
    });

    const nextStep = () => {
        setActiveStep((current) => {
            if (form.validate().hasErrors) {
                return current;
            }
            return current < 1 ? current + 1 : current;
        });
    };

    const prevStep = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    const onSubmit = async () => {
        if (form.validate().hasErrors) {
            return;
        }

        setSubmitting(true);

        try {
            // Step 1: Upload image first if it's a File
            let finalAvatarURL = form.values.avatarURL;
            if (form.values.avatarURL && form.values.avatarURL instanceof File) {
                setUploading(true);
                const date = new Date();
                const storageRef = ref(storage, `avatars/${authUser?.uid}_${date.toISOString()}`);
                const snapshot = await uploadBytes(storageRef, form.values.avatarURL);
                finalAvatarURL = await getDownloadURL(snapshot.ref);
                setUploading(false);
            }

            // Step 2: Create user data with uploaded image URL
            const userData = {
                ...form.values,
                avatarURL: finalAvatarURL
            };

            await createUserData(userData);

            // Step 3: Get fresh token and update auth state
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const token = await currentUser?.getIdToken(true);

            if (token) {
                updateAuthUser({
                    ...authUser!,
                    fullName: userData.fullName,
                    avatarURL: finalAvatarURL,
                    userType: userData.userType,
                } as IAuthUser, currentUser!);
            }

            notifications.show({
                title: `Success`,
                color: "green",
                message: "Profile completed successfully",
                position: "bottom-left",
            });

            navigate("/jobs");

        } catch (error: any) {
            console.error("Error creating user data:", error);
            notifications.show({
                title: `Error`,
                color: "red",
                message: error.message || "An error occurred while completing your profile",
                position: "bottom-left",
            });
        } finally {
            setSubmitting(false);
            setUploading(false);
        }
    };

    return (
        <Grid justify="center" mt={"md"}>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "16px",
                    }}
                >
                    <h1
                        style={{
                            flex: 1,
                            textAlign: "center",
                            fontSize: "20px",
                            fontWeight: "600",
                            margin: 0,
                            color: "#333",
                        }}
                    >
                        Complete Your Profile
                    </h1>
                </div>

                {/* Progress Steps */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "48px",
                        marginBottom: "16px",
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: activeStep >= 0 ? "#1c2e4a" : "#e9ecef",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 8px",
                            }}
                        >
                            {activeStep > 0 ? (
                                <span style={{ color: "white", fontSize: "16px" }}>✓</span>
                            ) : (
                                <span
                                    style={{
                                        color: activeStep >= 0 ? "white" : "#666",
                                        fontWeight: "500",
                                        fontSize: "16px",
                                    }}
                                >
                                    1
                                </span>
                            )}
                        </div>
                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: activeStep >= 0 ? "600" : "400",
                                color: activeStep >= 0 ? "#333" : "#999",
                            }}
                        >
                            Personal Info
                        </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: activeStep >= 1 ? "#1c2e4a" : "#e9ecef",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 8px",
                            }}
                        >
                            <span
                                style={{
                                    color: activeStep >= 1 ? "white" : "#666",
                                    fontWeight: "500",
                                    fontSize: "16px",
                                }}
                            >
                                2
                            </span>
                        </div>
                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: activeStep >= 1 ? "600" : "400",
                                color: activeStep >= 1 ? "#333" : "#999",
                            }}
                        >
                            Contact Info
                        </div>
                    </div>
                </div>

                {/* Step Content */}
                {activeStep === 0 && (
                    <Stack gap="md">
                        {/* Profile Picture */}
                        <Center>
                            <FileButton onChange={(file) => {
                                form.setFieldValue("avatarURL", file);
                            }} accept="image/png,image/jpeg">
                                {(props) => (
                                    <UnstyledButton {...props}>
                                        <Center>
                                            <Avatar
                                                src={
                                                    form.values.avatarURL
                                                        ? typeof form.values.avatarURL === "string"
                                                            ? form.values.avatarURL
                                                            : URL.createObjectURL(form.values.avatarURL)
                                                        : null
                                                }
                                                alt="Profile"
                                                size={"xl"}
                                            />
                                        </Center>
                                        <Text
                                            style={{
                                                color: "#999",
                                                fontSize: "14px",
                                                cursor: "pointer",
                                                textDecoration: "none",
                                            }}
                                        >
                                            {uploading
                                                ? "Uploading..."
                                                : "Select a profile picture (optional)"}
                                        </Text>
                                    </UnstyledButton>
                                )}
                            </FileButton>
                        </Center>

                        <TextInput
                            label="Full Name"
                            placeholder="Enter your full name"
                            {...form.getInputProps("fullName")}
                        />
                        <Select
                            label="Gender (Optional)"
                            placeholder="Select your gender"
                            data={["Male", "Female", "Prefer not to say"]}
                            {...form.getInputProps("gender")}
                        />
                        <Select
                            label="User Type"
                            placeholder="Select user type"
                            data={[
                                { value: "individual", label: "Individual" },
                                { value: "institution", label: "Institution" },
                            ]}
                            {...form.getInputProps("userType")}
                        />
                        <Select
                            label="Age Group (Optional)"
                            placeholder="Select age group"
                            data={["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]}
                            {...form.getInputProps("ageGroup")}
                        />

                        <Button onClick={nextStep} fullWidth color="#1c2e4a" size="md">
                            Next
                        </Button>
                    </Stack>
                )}

                {activeStep === 1 && (
                    <Stack gap={"md"}>
                        <div>
                            <Text size="md" fw={500}>
                                {"Phone Number"} <span style={{ color: "red" }}>*</span>
                            </Text>
                            <Grid grow>
                                <Grid.Col span="auto" pr="0px">
                                    <CountrySelector
                                        selectedCountry={phoneInput.country.iso2}
                                        onSelect={(country) => phoneInput.setCountry(country.iso2)}
                                        renderButtonWrapper={({ children, rootProps }) => (
                                            <Button
                                                {...rootProps}
                                                variant="outline"
                                                color="#CED4DA"
                                                px="4px"
                                                mr="8px"
                                                radius="md"
                                                size="md"
                                            >
                                                {children}
                                            </Button>
                                        )}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 8, md: 9, lg: 9 }} pl="0px">
                                    <TextInput
                                        withAsterisk
                                        placeholder="789XXXXXX"
                                        radius="md"
                                        leftSection={
                                            <Text c="black" size="md" mt={"2px"}>
                                                {phoneInput.phone}
                                            </Text>
                                        }
                                        leftSectionWidth={50}
                                        maxLength={15}
                                        error={form.errors.phoneNumber}
                                        value={form.values.phoneNumber}
                                        onChange={(phone) =>
                                            form.setFieldValue(
                                                "phoneNumber",
                                                phone.target.value.replace(/^0+/, "").replace(/\D/g, "")
                                            )
                                        }
                                        onBlur={() => {
                                            const isValidInput = /^\d*$/.test(
                                                form.values.phoneNumber
                                            );
                                            if (!isValidInput) {
                                                form.setFieldError(
                                                    "phoneNumber",
                                                    "Invalid phone number"
                                                );
                                            }
                                        }}
                                    />
                                </Grid.Col>
                            </Grid>
                        </div>
                        <Select
                            label="Country"
                            searchable
                            placeholder="Select your country"
                            value={form.values.country?.code || ""}
                            data={countries.map((country) => ({
                                value: country.code,
                                label: country.name,
                            }))}
                            onChange={(value) => {
                                const selectedCountry = countries.find(
                                    (country) => country.code === value
                                );
                                form.setFieldValue("country", selectedCountry || null);
                                if (selectedCountry) {
                                    const currency = getCurrencyForCountry(selectedCountry.code);
                                    form.setFieldValue("currency", currency);
                                } else {
                                    form.setFieldValue("currency", null);
                                }
                            }}
                            error={form.errors.country}
                        />

                        <Textarea
                            label="Bio (Optional)"
                            placeholder="Tell us about yourself"
                            description="A short bio helps others know you better"
                            {...form.getInputProps("bio")}
                            autosize
                            minRows={4}
                            maxRows={6}
                        />

                        {(uploading || submitting) && (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "16px",
                                    color: "#666",
                                    fontSize: "14px",
                                }}
                            >
                                {uploading ? "Uploading profile picture..." : "Completing profile..."}
                            </div>
                        )}

                        <Group wrap="nowrap">
                            <Button
                                onClick={prevStep}
                                variant="outline"
                                size="md"
                                color="#1c2e4a"
                                fullWidth
                                disabled={submitting}
                            >
                                Back
                            </Button>
                            <Button
                                onClick={onSubmit}
                                disabled={uploading || submitting}
                                color="#1c2e4a"
                                size="md"
                                fullWidth
                            >
                                {submitting ? "Completing..." : "Complete"}
                            </Button>
                        </Group>
                    </Stack>
                )}
            </Grid.Col>
        </Grid>
    );
}
