import { ShinyTextProps } from "@/app/types/ShinyTextProps";

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '', colorClassName = "shiny-text" }) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`${colorClassName} ${disabled ? 'disabled' : ''} ${className}`}
            style={{ animationDuration }}
        >
            {text}
        </div>
    );
};

export default ShinyText;