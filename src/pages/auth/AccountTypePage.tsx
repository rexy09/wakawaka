import {
  ActionIcon,
  Button,
  Center,
  Image,
  Paper,
  ScrollArea,
  Space,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { FiArrowRight, FiUser } from "react-icons/fi";
import polygon_1 from "../../assets/polygon_1.svg";
import polygon_2 from "../../assets/polygon_2.svg";
import sana_logo from "../../assets/sana_logo.svg";
import { Color, FontFamily } from "../../common/theme";
import { RiTruckLine } from "react-icons/ri";
import { MdArrowBackIos } from "react-icons/md";
import TransporterForm from "../../features/auth/ui/TransporterForm";
import SenderForm from "../../features/auth/ui/SenderForm";

export default function AccountTypePage() {
  const [accountType, setAccountType] = useState<
    "owner" | "sender" | "agent" | "" | string
  >("");
  const [selectedAccountType, setSelectedAccountType] = useState<
    "owner" | "sender" | "agent" | "" | string
  >("");

  return (
    <div>
      {selectedAccountType == "" && (
        <Center maw={"100%"} h={"100vh"}>
          <div className="w-[480px]">
            <Image w={155} src={sana_logo} />
            <Space h="md" />
            <Text
              size="40px"
              fw={700}
              c={Color.BrandBlue}
              style={{ lineHeight: "48px", letterSpacing: "-0.8px" }}
            >
              Create your Account{" "}
            </Text>
            <Space h="md" />
            <Text
              size="18px"
              fw={400}
              c={"#8692A6"}
              style={{ lineHeight: "28px", fontFamily: "Urbanist" }}
            >
              To begin this journey, tell us what type of account you’d be
              opening.
            </Text>
            <Space h="lg" />
            {[
              {
                type: "sender",
                icon: <FiUser color={Color.PrimaryBlue} />,
                icon2: <FiUser color={"white"} />,
                title: "Cargo Owner",
                description:
                  "I have Cargo Loads, Looking for Trucks/Transporter",
              },
              // {
              //   type: "agent",
              //   icon: <FiBriefcase color={Color.PrimaryBlue} />,
              //   icon2: <FiBriefcase color={'white'} />,
              //   title: "Clearing Agent",
              //   description: "I am a Clearing Agent, Looking for Transporters",
              // },
              {
                type: "owner",
                icon: <RiTruckLine color={Color.PrimaryBlue} />,
                icon2: <RiTruckLine color={"white"} />,
                title: "Transporter",
                description: "I have Trucks , am Looking for Cargo",
              },
            ].map((account) => (
              <Paper
                key={account.type}
                p="xl"
                mb={"sm"}
                radius="10px"
                bg={accountType === account.type ? "#F7FAFF" : "white"}
                style={{
                  border:
                    accountType === account.type
                      ? `2px solid ${Color.PrimaryBlue}`
                      : "2px solid #1A2F570F",
                }}
                w={"100%"}
                onClick={() => {
                  setAccountType(account.type);
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-x-3">
                    <div className="relative w-[52px] h-[52px]">
                      <img
                        src={
                          accountType === account.type ? polygon_1 : polygon_2
                        }
                        alt="Polygon"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {accountType === account.type
                          ? account.icon2
                          : account.icon}
                      </div>
                    </div>

                    <div className="max-w-[80%]">
                      <Text size="15px" fw={500} mb={"5px"}>
                        {account.title}
                      </Text>
                      <Text
                        size="14px"
                        c={"#8692A6"}
                        fw={400}
                        style={{ fontFamily: FontFamily.Manrope }}
                      >
                        {account.description}
                      </Text>
                    </div>
                  </div>
                  {accountType === account.type && (
                    <ActionIcon
                      variant="transparent"
                      onClick={() => {
                        setSelectedAccountType(accountType);
                      }}
                    >
                      <FiArrowRight color={Color.PrimaryBlue} size={20} />
                    </ActionIcon>
                  )}
                </div>
              </Paper>
            ))}

            <Space h="md" />
          </div>
        </Center>
      )}
      {accountType == "owner" && selectedAccountType == "owner" && (
        <ScrollArea h={"100vh"} w={"100%"} scrollbars="y" offsetScrollbars>
          <Center maw={"100%"}>
            <div className="maw-[480px]">
              <Space h="lg" />

              <Button
                leftSection={<MdArrowBackIos color="#8692A6" />}
                size="md"
                variant="subtle"
                color="#8692A6"
                onClick={() => {
                  setSelectedAccountType("");
                }}
              >
                Back
              </Button>
              <Space h="md" />
              <Text
                size="40px"
                fw={700}
                c={Color.BrandBlue}
                style={{ lineHeight: "48px", letterSpacing: "-0.8px" }}
              >
                Complete Profile
              </Text>
              <Space h="xs" />
              <Text
                size="18px"
                fw={400}
                c={"#8692A6"}
                style={{ lineHeight: "28px", fontFamily: "Urbanist" }}
              >
                For the purpose of industry regulation, your details are
                required.
              </Text>
              <Space h="lg" />
              <TransporterForm accountType={accountType} />
              <Space h="md" />
            </div>
          </Center>
        </ScrollArea>
      )}

      {accountType == "sender" && selectedAccountType == "sender" && (
        <ScrollArea h={"100vh"} w={"100%"} scrollbars="y" offsetScrollbars>

          <Center maw={"100%"}>
            <div className="maw-[480px]">
              <Space h="lg" />

              <Button
                leftSection={<MdArrowBackIos color="#8692A6" />}
                size="md"
                variant="subtle"
                color="#8692A6"
                onClick={() => {
                  setSelectedAccountType("");
                }}
              >
                Back
              </Button>
              <Space h="xl" />
              <Text
                size="40px"
                fw={700}
                c={Color.BrandBlue}
                style={{ lineHeight: "48px", letterSpacing: "-0.8px" }}
              >
                Complete Profile
              </Text>
              <Space h="md" />
              <Text
                size="18px"
                fw={400}
                c={"#8692A6"}
                style={{ lineHeight: "28px", fontFamily: "Urbanist" }}
              >
                For the purpose of industry regulation, your details are required.
              </Text>
              <Space h="lg" />
              <SenderForm accountType={accountType} />
              <Space h="md" />
            </div>
          </Center>
        </ScrollArea>
      )}
    </div>
  );
}
