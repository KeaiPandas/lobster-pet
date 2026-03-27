import Lobster from './Lobster'
import { useChatStore } from '../../services/store'

export default function PetContainer() {
  const petState = useChatStore((s) => s.petState)

  const handleClick = () => {
    ;(window as any).api?.openChat()
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
      <Lobster state={petState} onClick={handleClick} />
    </div>
  )
}
