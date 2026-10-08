const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/2] w-full rounded-tin bg-ecaille-tuile" />
      <div className="flex justify-between text-base-regular mt-2">
        <div className="w-2/5 h-6 bg-ecaille-tuile"></div>
        <div className="w-1/5 h-6 bg-ecaille-tuile"></div>
      </div>
    </div>
  )
}

export default SkeletonProductPreview
