type Props = Readonly<{
  text: string;
  isHidden: boolean;
}>;

export function HideText({ text, isHidden }: Props) {
  return (
    <span className={"relative group/item"}>
      {text}
      {isHidden && (
        <span
          className={
            "absolute inset-0 bg-gray-500 z-10 group-hover/item:bg-transparent"
          }
        />
      )}
    </span>
  );
}
