type Props = {
  title: string
}

export function Header({ title }: Props) {
  return (
    <div className="min-h-12 flex items-center gap-2">
      <div className="text-xl ">{title}</div>
    </div>
  )
}
