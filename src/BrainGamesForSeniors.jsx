import React, { useState, useEffect } from 'react';
import { Brain, Calculator, Eye, Home, ArrowLeft, CheckCircle, XCircle, Trophy, RefreshCw, Star } from 'lucide-react';

// --- Shared UI Components ---

const BigButton = ({ onClick, children, color = "blue", className = "" }) => {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1",
    green: "bg-emerald-600 hover:bg-emerald-700 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1",
    orange: "bg-orange-500 hover:bg-orange-600 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1",
    red: "bg-rose-500 hover:bg-rose-600 border-b-4 border-rose-700 active:border-b-0 active:translate-y-1",
    purple: "bg-purple-600 hover:bg-purple-700 border-b-4 border-purple-800 active:border-b-0 active:translate-y-1",
  };

  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} text-white text-2xl md:text-3xl font-bold py-6 px-8 rounded-2xl w-full transition-all flex items-center justify-center gap-3 shadow-lg ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-3xl shadow-xl p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

const GameHeader = ({ title, onBack, score }) => (
  <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-md">
    <button 
      onClick={onBack}
      className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl flex items-center gap-2 font-bold text-lg transition-colors"
    >
      <ArrowLeft size={28} />
      返回
    </button>
    <h2 className="text-3xl font-black text-slate-800">{title}</h2>
    <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-xl font-bold text-xl">
      <Star className="fill-amber-500 text-amber-500" />
      <span>{score} 分</span>
    </div>
  </div>
);

// --- Game 1: Memory Match ---

// 更新：使用更具文化感和生活气息的图标，更容易唤起老年人记忆
const MEMORY_ICONS = [
  { id: 1, icon: "🀄", name: "麻将-红中" },
  { id: 2, icon: "🏮", name: "红灯笼" },
  { id: 3, icon: "🍵", name: "热茶壶" },
  { id: 4, icon: "🥟", name: "热饺子" },
  { id: 5, icon: "🌾", name: "金麦穗" },
  { id: 6, icon: "🥢", name: "一双筷子" },
];

const MemoryGame = ({ onBack }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Duplicate and shuffle
    const deck = [...MEMORY_ICONS, ...MEMORY_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({ ...item, uniqueId: index }));
    
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setGameOver(false);
  };

  const handleCardClick = (index) => {
    if (gameOver || flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].id)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.id === secondCard.id) {
        setMatched([...matched, firstCard.id]);
        setScore(s => s + 10);
        setFlipped([]);
        if (matched.length + 1 === MEMORY_ICONS.length) {
          setTimeout(() => setGameOver(true), 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <GameHeader title="记忆翻翻乐" onBack={onBack} score={score} />
      
      {gameOver ? (
        <Card className="text-center py-12">
          <Trophy size={80} className="mx-auto text-yellow-500 mb-6" />
          <h3 className="text-4xl font-bold text-slate-800 mb-4">太棒了！</h3>
          <p className="text-2xl text-slate-600 mb-8">你完成了所有配对！</p>
          <BigButton onClick={startNewGame} color="green">再玩一次</BigButton>
        </Card>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(card.id);
            return (
              <button
                key={card.uniqueId}
                onClick={() => handleCardClick(index)}
                className={`aspect-square rounded-2xl text-6xl flex items-center justify-center transition-all transform duration-300 ${
                  isFlipped 
                    ? "bg-white border-4 border-blue-400 rotate-0" 
                    : "bg-blue-500 rotate-y-180"
                } shadow-md`}
                disabled={isFlipped}
              >
                {/* 增加了字体大小 text-6xl 以便看得更清 */}
                {isFlipped ? card.icon : <span className="text-white opacity-50 text-4xl">✦</span>}
              </button>
            );
          })}
        </div>
      )}
      <p className="text-center text-slate-500 mt-6 text-xl">点击卡片，找出相同的图案</p>
    </div>
  );
};

// --- Game 2: Simple Math ---

const MathGame = ({ onBack }) => {
  const [problem, setProblem] = useState({ a: 0, b: 0, op: '+', ans: 0 });
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(null); // 'correct' or 'wrong'

  const generateProblem = () => {
    const isAdd = Math.random() > 0.4; // 60% chance addition
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * (isAdd ? 20 : a)) + 1; // Ensure subtraction isn't negative
    const ans = isAdd ? a + b : a - b;
    
    // Generate distinct distractors
    let distractors = new Set();
    while(distractors.size < 2) {
      let d = ans + Math.floor(Math.random() * 10) - 5;
      if (d !== ans && d > 0) distractors.add(d);
    }
    
    const opts = [ans, ...Array.from(distractors)].sort(() => Math.random() - 0.5);
    
    setProblem({ a, b, op: isAdd ? '+' : '-', ans });
    setOptions(opts);
    setMessage(null);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleAnswer = (val) => {
    if (message) return; // Prevent double clicking

    if (val === problem.ans) {
      setMessage('correct');
      setScore(s => s + 10);
      setTimeout(generateProblem, 1500);
    } else {
      setMessage('wrong');
      setTimeout(() => setMessage(null), 1000); // Give them another chance
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <GameHeader title="趣味算术" onBack={onBack} score={score} />
      
      <Card className="text-center py-10">
        <div className="flex items-center justify-center gap-4 text-6xl md:text-8xl font-black text-slate-800 mb-12">
          <span>{problem.a}</span>
          <span className="text-blue-500">{problem.op}</span>
          <span>{problem.b}</span>
          <span>=</span>
          <span className="text-blue-600">?</span>
        </div>

        {message === 'correct' && (
          <div className="mb-6 animate-bounce text-green-600 text-3xl font-bold flex justify-center items-center gap-2">
            <CheckCircle size={40} /> 回答正确！
          </div>
        )}
        {message === 'wrong' && (
          <div className="mb-6 animate-pulse text-red-500 text-3xl font-bold flex justify-center items-center gap-2">
            <XCircle size={40} /> 再试一次
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="bg-slate-100 hover:bg-blue-100 border-b-4 border-slate-300 hover:border-blue-300 active:border-b-0 active:translate-y-1 text-4xl md:text-6xl font-bold py-8 rounded-2xl text-slate-700 transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
      </Card>
      <p className="text-center text-slate-500 mt-6 text-xl">请计算上方题目的答案</p>
    </div>
  );
};

// --- Game 3: Color Focus ---

const FocusGame = ({ onBack }) => {
  const COLORS = [
    { name: '红色', class: 'bg-red-500', id: 'red' },
    { name: '蓝色', class: 'bg-blue-500', id: 'blue' },
    { name: '绿色', class: 'bg-green-500', id: 'green' },
    { name: '黄色', class: 'bg-yellow-400', id: 'yellow' },
  ];
  
  const [target, setTarget] = useState(null);
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);

  const initRound = () => {
    // Pick a target
    const newTarget = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTarget(newTarget);

    // Generate grid (mostly distractions, one correct)
    // Actually let's make it simpler: Just 4 big buttons with different colors
    // But rearrange the NAMES to make it a simplified Stroop test? 
    // No, let's stick to simple "Find the Color" first for general elderly.
    
    // Shuffle the colors
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
    setGrid(shuffled);
    setShowFeedback(null);
  };

  useEffect(() => {
    initRound();
  }, [round]);

  const handleSelect = (colorId) => {
    if (showFeedback) return;

    if (colorId === target.id) {
      setShowFeedback('correct');
      setScore(s => s + 10);
      setTimeout(() => setRound(r => r + 1), 1000);
    } else {
      setShowFeedback('wrong');
      setTimeout(() => setShowFeedback(null), 800);
    }
  };

  if (!target) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <GameHeader title="眼疾手快" onBack={onBack} score={score} />

      <Card className="text-center py-8">
        <h3 className="text-3xl text-slate-600 mb-4">请点击下面的：</h3>
        <div className={`inline-block px-12 py-4 rounded-xl text-5xl md:text-6xl font-black mb-8 border-4 border-dashed border-slate-300`}>
             <span style={{ 
               // Trick: The text color is just black to avoid confusion for now, 
               // can be changed to random colors for higher difficulty later
               color: '#334155' 
             }}>
               {target.name} 按钮
             </span>
        </div>

        {showFeedback === 'correct' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 p-6 rounded-2xl shadow-2xl z-10 border-4 border-green-500">
             <CheckCircle size={80} className="text-green-500 mx-auto" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 mt-4">
          {grid.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`${c.class} h-32 md:h-40 rounded-2xl shadow-lg transform active:scale-95 transition-transform border-4 border-white ring-4 ring-slate-100`}
              aria-label={c.name}
            />
          ))}
        </div>
      </Card>
      <p className="text-center text-slate-500 mt-6 text-xl">找到与文字描述颜色相同的方块</p>
    </div>
  );
};

// --- Main Menu ---

const Menu = ({ onSelectGame }) => (
  <div className="max-w-md mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
    <div className="text-center space-y-2 mb-10">
      <div className="inline-flex bg-white p-4 rounded-full shadow-md mb-2">
        <Brain size={64} className="text-pink-500" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">银发健脑乐园</h1>
      <p className="text-xl text-slate-500">每天练一练，大脑更年轻</p>
    </div>

    <div className="space-y-4">
      <BigButton onClick={() => onSelectGame('memory')} color="blue">
        <div className="bg-white/20 p-2 rounded-lg">
           <Eye size={32} />
        </div>
        <span>记忆翻翻乐</span>
      </BigButton>

      <BigButton onClick={() => onSelectGame('math')} color="green">
        <div className="bg-white/20 p-2 rounded-lg">
           <Calculator size={32} />
        </div>
        <span>趣味算术题</span>
      </BigButton>

      <BigButton onClick={() => onSelectGame('focus')} color="orange">
        <div className="bg-white/20 p-2 rounded-lg">
           <RefreshCw size={32} />
        </div>
        <span>眼疾手快</span>
      </BigButton>
    </div>

    <div className="mt-12 p-6 bg-white/60 rounded-2xl text-center text-slate-600">
       <p className="font-bold mb-1">💡 温馨提示</p>
       <p>不用着急，慢慢来，享受游戏的乐趣。</p>
    </div>
  </div>
);

// --- App Container ---

export default function App() {
  const [currentView, setCurrentView] = useState('menu');

  const renderView = () => {
    switch(currentView) {
      case 'menu':
        return <Menu onSelectGame={setCurrentView} />;
      case 'memory':
        return <MemoryGame onBack={() => setCurrentView('menu')} />;
      case 'math':
        return <MathGame onBack={() => setCurrentView('menu')} />;
      case 'focus':
        return <FocusGame onBack={() => setCurrentView('menu')} />;
      default:
        return <Menu onSelectGame={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 font-sans">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <main className="relative z-10 px-4 py-8 md:py-12">
        {renderView()}
      </main>
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}