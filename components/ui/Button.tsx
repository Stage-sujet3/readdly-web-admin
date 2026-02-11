type ButtonProps = {
    type?: "button" | "submit" | "reset"
    disabled?: boolean
    className?: string
    onClick?: () => void
    children: React.ReactNode
}

export default function Button({ type = "button", disabled, className, onClick, children }: ButtonProps) {
    return (
        <button type={type} disabled={disabled} className={className} onClick={onClick}>
            {children}
        </button>
    )
}
