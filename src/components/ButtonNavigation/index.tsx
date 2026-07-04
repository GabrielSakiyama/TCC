import { ReactNode as nodeChild } from "react"

interface buttonIcon{
    child: nodeChild
}

export default function ButtonNavigation({child}: buttonIcon) {
    return (
        <button className="border-3 border-gray-400 rounded-3xl p-2 bg-white transition duration-1000  hover:bg-gray-600">
            {child}
        </button>
    )
}