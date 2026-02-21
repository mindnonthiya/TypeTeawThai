import { useState } from 'react';
import { useLang } from '@/contexts/LanguageContext';

export type QuizOption = {
  id: number;
  question_id: number;
  option_label: string;
  option_th: string;
  option_en: string;
};

export type QuizQuestion = {
  id: number;
  question_no: number;
  question_th: string;
  question_en: string;
  options: QuizOption[];
};

export default function QuizStepper({
  questions,
  onFinish,
}: {
  questions: QuizQuestion[];
  onFinish: (answersByQuestionId: Record<number, number>, selectedOptionIds: number[]) => void;
}) {
  const { t, lang } = useLang();
  const [idx, setIdx] = useState(0);

  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    const init: Record<number, number> = {};
    for (const q of questions) init[q.id] = 0;
    return init;
  });

  const q = questions[idx];
  const selected = answers[q.id] || 0;

  function choose(optionId: number) {
    setAnswers((p) => ({ ...p, [q.id]: optionId }));
  }

  function back() {
    if (idx > 0) setIdx((p) => p - 1);
  }

  function next() {
    if (!selected) return;
    if (idx < questions.length - 1) {
      setIdx((p) => p + 1);
    } else {
      const optionIds = Object.values(answers).filter(Boolean);
      onFinish(answers, optionIds);
    }
  }

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="muted">
        {lang === 'th' ? 'คำถาม' : 'Question'} {idx + 1} / {questions.length}
      </div>
      <div className="card">
        <div className="h2">{lang === 'th' ? q.question_th : q.question_en}</div>
        <div className="grid" style={{ gap: 10, marginTop: 12 }}>
          {q.options.map((op) => (
            <label key={op.id} className="card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <input
                  type="radio"
                  name={`q_${q.id}`}
                  checked={selected === op.id}
                  onChange={() => choose(op.id)}
                  style={{ marginTop: 3 }}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>{op.option_label}.</div>
                  <div>{lang === 'th' ? op.option_th : op.option_en}</div>
                </div>
              </div>
            </label>
          ))}
        </div>

        {!selected && <div className="muted" style={{ marginTop: 10 }}>{t('chooseFirst')}</div>}

        <div className="row" style={{ marginTop: 14 }}>
          {idx > 0 && <button onClick={back}>{t('back')}</button>}
          <button className="primary" onClick={next} disabled={!selected}>
            {idx < questions.length - 1 ? t('next') : t('finish')}
          </button>
        </div>
      </div>
    </div>
  );
}
