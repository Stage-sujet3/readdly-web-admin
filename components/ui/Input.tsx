type InputProps = {
    id?: string
    type?: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    style?: React.CSSProperties
    onFocus?: () => void
    onBlur?: () => void
}

export default function Input({ id, type = "text", value, onChange, placeholder, className, style, onFocus, onBlur }: InputProps) {
    return (
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={className}
            style={style}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    )
}
