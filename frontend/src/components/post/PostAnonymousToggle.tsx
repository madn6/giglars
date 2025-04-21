
export default function PostAnonymousToggle() {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
    <label className="flex items-center gap-2 cursor-pointer">
        <input
            type="checkbox"
            className="accent-blue-500 rounded-full"
            onChange={(e) => console.log('Anonymous:', e.target.checked)}
        />
        Post as Anonymous
    </label>
</div>  )
}