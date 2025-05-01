
interface ProgressBarProps{
   step:number
}

export default function ProfileProgress({step}: ProgressBarProps) {
	return (
		<div>
			{/* Progress Bar */}
			<div className=" w-54  mx-auto">
				<div className="flex items-center justify-between my-6">
					{/* Step 1 */}
					<div
						className={`h-10 w-10 rounded-full flex items-center justify-center ${
							step >= 1 ? 'bg-blue-600' : 'bg-gray-300'
						} transition-colors`}
					>
						1
					</div>

					{/* Connector */}
					<div
						className={`h-1 flex-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}  transition-colors`}
					></div>

					{/* Step 2 */}
					<div
						className={`h-10 w-10 rounded-full flex items-center justify-center ${
							step >= 2 ? 'bg-blue-600' : 'bg-gray-300 text-blue-600'
						} transition-colors`}
					>
						2
					</div>
				</div>
			</div>
		</div>
	);
}
