

export default function PostTagsInput() {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
    <span>Tags:</span>
    <input
      type="text"
      placeholder="#luckymoment"
      className="p-1 w-23 rounded bg-gray-800 text-white outline-none"
      onChange={(e) => console.log('Tags:', e.target.value)}
    />
  </div>  )
}