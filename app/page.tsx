'use client';

import React, { useState } from 'react';
import { Upload, MessageCircle, FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function MusicBriefAnalyzer() {
  const [step, setStep] = useState('input');
  const [briefText, setBriefText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [refinedBrief, setRefinedBrief] = useState('');

  const analyzeBrief = async () => {
    setStep('analyzing');
    
    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: `You are an expert music supervisor analyzing a music brief. 

Score this brief out of 10 using this framework:

ESSENTIAL (6 points possible):
- Clear emotional direction (2 pts) - How should viewer feel?
- Visual/narrative context (2 pts) - What's happening on screen?
- Music's role (2 pts) - Hero or supportive? Under VO?

STRONG (3 points possible):
- Specific musical characteristics (1 pt) - Tempo, instrumentation, vocals
- Reference tracks with context (1 pt) - Not just "I like this" but WHY
- Practical details (1 pt) - Stems needed? Multiple cuts? Budget range?

EXCELLENT (1 point possible):
- Target audience insights (0.5 pts)
- Cultural/sonic strategy (0.5 pts)

Analyze this brief and return a JSON object with this structure:
{
  "score": <number out of 10>,
  "strengths": ["strength 1", "strength 2"],
  "gaps": ["gap 1", "gap 2", "gap 3"],
  "questions": [
    {"question": "...", "context": "why we're asking", "category": "emotional|musical|practical|audience"},
    ...3-5 questions total
  ]
}

Brief to analyze:
${briefText}

Return ONLY the JSON object, no other text.`
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const content = data.content[0].text;
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      const analysisData = JSON.parse(cleanContent);
      
      setAnalysis(analysisData);
      setStep('analysis');
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Error analyzing brief. Please try again.');
      setStep('input');
    }
  };

  const handleAnswer = (answer: string) => {
    const questionKey = `q${currentQuestion}`;
    setAnswers({ ...answers, [questionKey]: answer });
    
    if (currentQuestion < analysis.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateRefinedBrief();
    }
  };

  const generateRefinedBrief = async () => {
    setStep('generating');
    
    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: `You are an expert music supervisor. Create a refined, professional music brief.

Original brief:
${briefText}

Questions asked and answers:
${analysis.questions.map((q: any, i: number) => `Q: ${q.question}\nA: ${answers[`q${i}`]}`).join('\n\n')}

Create a refined brief in this style (use clear sections, be specific, include all relevant details):

# Music Brief: [Project Name]

## Project Context
[What's happening visually/narratively]

## Emotional Direction
[How should the viewer feel? What's the emotional journey?]

## Musical Characteristics
- Tempo: [BPM range or descriptive]
- Instrumentation: [Specific instruments or sound palette]
- Vocals: [Male/Female/None/Instrumental]
- Genre/Style: [Specific but not limiting]

## Reference Tracks
[Track name - Artist]
- Why this reference: [What specifically do you like?]

## Practical Requirements
- Duration: [Length needed]
- Role of music: [Hero/supportive, under VO, etc.]
- Stems needed: [Yes/No]
- Other technical needs: [Any special requirements]

## Target Audience
[Who are we reaching and why does it matter?]

## Additional Context
[Budget range, territory, usage rights, deadlines, etc.]

Write the brief in a professional, clear tone. Be specific but not restrictive. Give the music supervisor enough to work with while leaving room for creative discovery.`
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const brief = data.content[0].text;
      setRefinedBrief(brief);
      setStep('output');
    } catch (error) {
      console.error('Generation error:', error);
      alert('Error generating brief. Please try again.');
    }
  };

  const startOver = () => {
    setStep('input');
    setBriefText('');
    setAnalysis(null);
    setCurrentQuestion(0);
    setAnswers({});
    setRefinedBrief('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Music Brief Analyzer</h1>
          <p className="text-gray-600">Transform your brief into something music supervisors will love</p>
        </div>

        {step === 'input' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-semibold">Paste Your Music Brief</h2>
            </div>
            
            <textarea
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-mono text-sm"
              placeholder="Paste your existing music brief here, or describe your project and what kind of music you're looking for..."
              value={briefText}
              onChange={(e) => setBriefText(e.target.value)}
            />
            
            <button
              onClick={analyzeBrief}
              disabled={briefText.trim().length < 50}
              className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Analyze My Brief <ArrowRight className="w-5 h-5" />
            </button>
            
            {briefText.trim().length < 50 && briefText.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">Please enter at least 50 characters</p>
            )}
          </div>
        )}

        {step === 'analyzing' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-pulse">
              <MessageCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Analyzing your brief...</h2>
              <p className="text-gray-600">Looking for strengths and gaps</p>
            </div>
          </div>
        )}

        {step === 'analysis' && analysis && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Brief Quality Score</h2>
                <div className="text-5xl font-bold text-purple-600">{analysis.score}/10</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(analysis.score / 10) * 100}%` }}
                />
              </div>
            </div>

            {analysis.strengths.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-lg">What's Working</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.gaps.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">What's Missing</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.gaps.map((gap: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-orange-600 mt-1">⚠</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <p className="text-purple-900">
                <strong>Let's level up your brief!</strong> I'll ask {analysis.questions.length} targeted questions to get you to a 9/10.
              </p>
            </div>

            <button
              onClick={() => setStep('questions')}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              Start Questions <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 'questions' && analysis && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-semibold">Question {currentQuestion + 1} of {analysis.questions.length}</h2>
                <span className="text-sm text-gray-500">{analysis.questions[currentQuestion].category}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / analysis.questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{analysis.questions[currentQuestion].question}</h3>
              <p className="text-gray-600 text-sm mb-4">{analysis.questions[currentQuestion].context}</p>
              
              <textarea
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="Your answer..."
                value={answers[`q${currentQuestion}`] || ''}
                onChange={(e) => setAnswers({ ...answers, [`q${currentQuestion}`]: e.target.value })}
                autoFocus
              />
            </div>

            <button
              onClick={() => handleAnswer(answers[`q${currentQuestion}`] || '')}
              disabled={!answers[`q${currentQuestion}`]?.trim()}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {currentQuestion < analysis.questions.length - 1 ? 'Next Question' : 'Generate Refined Brief'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 'generating' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-pulse">
              <FileText className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Crafting your refined brief...</h2>
              <p className="text-gray-600">Combining your answers into a professional format</p>
            </div>
          </div>
        )}

        {step === 'output' && refinedBrief && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-semibold">Your Refined Brief</h2>
              </div>
              <div className="text-3xl font-bold text-green-600">~9/10</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">{refinedBrief}</pre>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(refinedBrief);
                  alert('Brief copied to clipboard!');
                }}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={startOver}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Analyze Another Brief
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}