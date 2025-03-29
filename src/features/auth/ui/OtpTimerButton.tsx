import { Button } from "@mantine/core";
import { useEffect, useState } from "react";

interface Props {
    seconds: number;
    resend: () => void;
}

export default function OtpTimerButton({ seconds, resend }: Props) {
    const [timeLeft, setTimeLeft] = useState(seconds);

    // Countdown logic
    useEffect(() => {
        // Set initial time when seconds prop changes
        setTimeLeft(seconds);

        const interval = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [seconds]); // Add seconds as dependency to restart when it changes

    const handleResend = () => {
        resend();
        setTimeLeft(seconds); // This will trigger the useEffect due to seconds dependency
    };

    return (
        <Button
            variant="light"
            onClick={handleResend}
            disabled={timeLeft > 0}
            size="md"
        >
            Resend {timeLeft > 0 ? (
                `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`
            ) : (
                ""
            )}
        </Button>
    );
}