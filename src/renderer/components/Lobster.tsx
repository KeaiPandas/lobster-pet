import type { PetState } from '../../shared/types'

interface LobsterProps {
  state: PetState
  onClick?: () => void
}

export default function Lobster({ state, onClick }: LobsterProps) {
  return (
    <div className="lobster-wrapper" onClick={onClick}>
      {/* 思考气泡 */}
      {state === 'thinking' && (
        <div className="thinking-bubble">
          <span className="bubble-dot" style={{ animationDelay: '0s' }} />
          <span className="bubble-dot" style={{ animationDelay: '0.3s' }} />
          <span className="bubble-dot" style={{ animationDelay: '0.6s' }} />
        </div>
      )}

      {/* 小龙虾主体 */}
      <div className={`lobster lobster-${state}`}>
        {/* 左钳子 */}
        <div className="claw claw-left">
          <div className="claw-arm" />
          <div className="claw-hand">
            <div className="claw-top" />
            <div className="claw-bottom" />
          </div>
        </div>

        {/* 身体 */}
        <div className="body">
          {/* 眼睛 */}
          <div className="eyes">
            <div className="eye eye-left">
              <div className="pupil" />
            </div>
            <div className="eye eye-right">
              <div className="pupil" />
            </div>
          </div>
          {/* 嘴巴 */}
          <div className="mouth" />
        </div>

        {/* 右钳子 */}
        <div className="claw claw-right">
          <div className="claw-arm" />
          <div className="claw-hand">
            <div className="claw-top" />
            <div className="claw-bottom" />
          </div>
        </div>

        {/* 腿 */}
        <div className="legs">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`leg leg-${i}`} />
          ))}
        </div>

        {/* 尾巴 */}
        <div className="tail">
          <div className="tail-segment t1" />
          <div className="tail-segment t2" />
          <div className="tail-segment t3" />
        </div>
      </div>

      <style>{css}</style>
    </div>
  )
}

const css = `
.lobster-wrapper {
  cursor: pointer;
  -webkit-app-region: drag;
  user-select: none;
}

.lobster {
  position: relative;
  width: 120px;
  height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* === Idle 浮动动画 === */
.lobster-idle {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* === Attention 微张钳子 === */
.lobster-attention .claw-hand {
  transform: rotate(5deg);
}
.lobster-attention .claw-right .claw-hand {
  transform: rotate(-5deg);
}

/* === Thinking 冒泡 === */
.lobster-thinking {
  animation: float 2s ease-in-out infinite;
}

.thinking-bubble {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  background: rgba(255,255,255,0.85);
  border-radius: 12px;
  padding: 4px 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.bubble-dot {
  width: 6px; height: 6px;
  background: #e74c3c;
  border-radius: 50%;
  animation: bounce 1.2s ease-in-out infinite;
}
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* === 身体 === */
.body {
  width: 70px;
  height: 65px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border-radius: 35px 35px 20px 20px;
  position: relative;
  z-index: 2;
  box-shadow: inset 0 -8px 16px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1);
}

/* === 眼睛 === */
.eyes {
  display: flex;
  justify-content: center;
  gap: 14px;
  position: absolute;
  top: 10px;
}
.eye {
  width: 20px;
  height: 22px;
  background: #fff;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}
.pupil {
  width: 10px;
  height: 11px;
  background: #2c3e50;
  border-radius: 50%;
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
}
.pupil::after {
  content: '';
  width: 3px;
  height: 3px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  right: 1px;
}

/* === 嘴巴 === */
.mouth {
  width: 14px;
  height: 7px;
  border-bottom: 3px solid #c0392b;
  border-radius: 0 0 50% 50%;
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
}

/* === 钳子 === */
.claw {
  position: absolute;
  top: 8px;
  z-index: 1;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}
.claw-left {
  left: -18px;
}
.claw-right {
  right: -18px;
}
.claw-right .claw-arm {
  order: 2;
}
.claw-right .claw-hand {
  order: 1;
  transform: scaleX(-1);
}
.claw-arm {
  width: 16px;
  height: 8px;
  background: linear-gradient(180deg, #e74c3c, #c0392b);
  border-radius: 4px;
}
.claw-hand {
  position: relative;
  width: 22px;
  height: 18px;
  transition: transform 0.3s ease;
}
.claw-top {
  width: 22px;
  height: 10px;
  background: #e74c3c;
  border-radius: 10px 10px 2px 2px;
  position: absolute;
  top: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.claw-bottom {
  width: 18px;
  height: 9px;
  background: #c0392b;
  border-radius: 2px 2px 8px 8px;
  position: absolute;
  bottom: 0;
  left: 2px;
}

/* === 腿 === */
.legs {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  display: flex;
  justify-content: space-between;
  z-index: 1;
}
.leg {
  width: 4px;
  height: 20px;
  background: #c0392b;
  border-radius: 0 0 3px 3px;
}
.leg:nth-child(odd) {
  transform: rotate(-15deg);
}
.leg:nth-child(even) {
  transform: rotate(15deg);
}

/* === 尾巴 === */
.tail {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 0;
  margin-top: -5px;
}
.tail-segment {
  height: 14px;
  background: linear-gradient(180deg, #e74c3c, #c0392b);
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.t1 { width: 55px; }
.t2 { width: 42px; margin-top: -2px; }
.t3 {
  width: 28px;
  margin-top: -2px;
  border-radius: 3px 3px 12px 12px;
}
`
