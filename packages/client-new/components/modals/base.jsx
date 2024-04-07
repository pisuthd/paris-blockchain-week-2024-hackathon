import { X } from "react-feather"


const BaseModal = ({
    visible,
    title,
    close,
    children,
    borderColor = "border-gray/10",
    maxWidth = "max-w-2xl"
}) => {
    return (
        <>
            {visible && (
                <div className="fixed inset-0 flex items-center justify-center z-100">
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className={`relative bg-white p-6 w-full ${maxWidth} border ${borderColor} text-white rounded-lg`}>
                        <h5 className="text-xl font-bold mb-2">{title}</h5>
                        <button className="absolute top-3 right-3  " onClick={close}>
                            <X />
                        </button>
                        {children}
                    </div>
                </div>
            )}
        </>
    )
}

export default BaseModal