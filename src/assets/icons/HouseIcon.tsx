import { House } from "lucide-react";

type HouseIconProps = {
    color?: string;
    className?: string;
};

export function HouseIcon({
    color = "currentColor",
    className = "h-5 w-5",
}: HouseIconProps) {
    return (
        <House
            color={color}
            className={className}
            aria-hidden="true"
        />
    );
}
