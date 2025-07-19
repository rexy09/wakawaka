import {
  Container,
  Grid,
  Text
} from "@mantine/core";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <Container fluid style={{ height: "100vh" }} m={0} p={0}>
      <Grid gutter={0} m={0} p={0}>
        <Grid.Col span={{ base: 12, md: 6 }} px={"md"}>
          <Outlet />
        </Grid.Col>
        <Grid.Col span={6} visibleFrom="md" bg={"#151F42"} p={0}>
          <div className=" md:flex relative bg-[#151F42] h-full items-center justify-center overflow-hidden">
            <div className="absolute top-10 left-10 text-white">
              <Text fz={64} fw={700} c={"white"} style={{ lineHeight: "58px" }}>Find Your</Text>
              <Text fz={64} fw={700} c={"white"} style={{ lineHeight: "58px" }}>Dream Job</Text>
              <p className="text-[20px] mt-2">Finding, Connecting<br />Building Success</p> 
            </div>
            {/* Circle 1 (Rotate 19) */}
            <div className="absolute top-[340px] right-[30px] bg-[#BFBCF3] px-6 py-4 rounded-[50%] shadow h-[80px] w-[80px] flex items-center justify-center opacity-0 animate-fade-in-up-rotate-19 delay-400">
            </div>
            <div className="absolute top-[320px] left-[20px] bg-orange-500 px-6 py-4 rounded-[9px] shadow text-[40px] font-bold h-[91px] w-[260px] flex items-center justify-center opacity-0 animate-fade-in-up-rotate-19 delay-300">
              Cleaning
            </div>

            <div className="absolute top-[200px] right-[20px] bg-orange-500 px-6 py-4 rounded-[9px] shadow text-[40px] font-bold h-[91px] w-[260px] flex items-center justify-center opacity-0 animate-fade-in-up-rotate--17 delay-500">
              Cooking
            </div>
            {/* Designer */}
            <div className="absolute top-[350px] left-[330px] bg-white px-6 py-4 rounded-[9px] shadow text-[40px] font-bold h-[91px] w-[260px] flex items-center justify-center opacity-0 animate-fade-in-up-rotate-19 delay-300">
              Designer
            </div>

         

            {/* Developer */}
            <div className="absolute top-[490px] left-[170px] bg-white px-6 py-4 rounded-[9px] shadow text-[40px] font-bold h-[91px] w-[222px] flex items-center justify-center opacity-0 animate-fade-in-up-rotate--58 delay-500">
              Developer
            </div>

            {/* Marketer */}
            <div className="absolute top-[550px] left-[400px] bg-white px-6 py-4 rounded-[9px] shadow text-[40px] font-bold h-[91px] w-[222px] flex items-center justify-center opacity-0 animate-fade-in-up-rotate--24 delay-600">
              Marketer
            </div>

            {/* Writer */}
            <div className="absolute top-[700px] left-[20px] bg-orange-500 px-6 py-4 rounded-[9px] shadow text-[40px] font-bold h-[91px] w-[260px] flex items-center justify-center opacity-0 animate-fade-in-up-rotate--17 delay-700">
              Writer
            </div>

            {/* Circle 2 (No text or rotation) */}
            <div className="absolute top-[650px] right-[30px] bg-[#6247BA] rounded-[50%] shadow h-[190px] w-[190px] flex items-center justify-center opacity-0 animate-fade-in-up delay-800">
            </div>

            {/* Circle 3 (Rotate -58) */}
            <div className="absolute top-[520px] left-[20px] bg-[#BFBCF3] px-6 py-4 rounded-[50%] shadow h-[80px] w-[214px] flex items-center justify-center opacity-0 animate-fade-in-up-rotate--58 delay-900">
            </div>
            
          </div>
          
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default AuthLayout;
