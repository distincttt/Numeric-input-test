import { Routes, Route } from 'react-router-dom'
import PersonEdit from '@/views/PersonEdit'
import PersonList from '@/views/PersonList'
import Settings from '@/views/Settings'

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Routes>
        <Route path="/" element={<PersonList />} />
        <Route path="/person/:id" element={<PersonEdit />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  )
}
