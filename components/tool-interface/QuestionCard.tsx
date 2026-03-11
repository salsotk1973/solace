import Card from "../ui/Card";

type Props = {
  question: string;
};

export default function QuestionCard({ question }: Props) {
  return (
    <Card>
      <div className="mb-3 text-sm font-medium text-neutral-500">
        You
      </div>

      <div className="text-[1.05rem] leading-8 text-neutral-900">
        {question}
      </div>
    </Card>
  );
}