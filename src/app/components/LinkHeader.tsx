
import { ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";

interface LinkProps {
    title: string
    signin?: boolean
    ref?: string
    children?: React.ReactNode
    onClick?: () => void;
}

export default function LinkHeader(props: LinkProps) {
    const handleClick = () => {
        if (props.onClick) {
          props.onClick();
        }
      };
    return (
        <div className={!props.signin ? `hover:bg-gray-100 hover:cursor-pointer p-4 flex flex-col gap-4 relative` : `bg-gray-100 hover:cursor-pointer p-4 flex flex-col gap-4 relative`} onClick={handleClick}>
            <div className="flex flex-row items-center justify-between gap-1">{props.title} {props.signin ? <VscAccount className="" /> : <FaChevronDown className="w-3" />}</div>
            {props.children}
        </div>


    )
}