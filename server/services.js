import { v2 as cloudinary } from 'cloudinary'

export function configureCloudinary(env) {
  if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
    cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET })
  }
}

export function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) return reject(Object.assign(new Error('Image uploads require Cloudinary configuration.'), { status: 503 }))
    const stream = cloudinary.uploader.upload_stream({ folder: 'repair-before-replace/items', resource_type: 'image' }, (error, result) => {
      if (error) return reject(error)
      resolve({ url: result.secure_url, publicId: result.public_id })
    })
    stream.end(buffer)
  })
}

export function generateDiagnosis(input) {
  const isElectronics = input.category === 'Electronics'
  const isTextile = input.category === 'Clothing & textiles'
  const summary = isTextile ? 'The item likely needs a small hardware or seam repair.' : isElectronics ? 'A loose connection or blocked port is the most likely cause.' : 'A small mechanical adjustment or connection issue is the most likely cause.'
  const causes = isElectronics ? [
    { title: 'Loose internal connection', score: 92, detail: 'The most likely cause based on the intermittent symptom and item age.' },
    { title: 'Worn cable or port', score: 64, detail: 'A secondary possibility worth checking before opening the item.' },
    { title: 'Component degradation', score: 31, detail: 'Less likely, but possible if the issue worsens over time.' },
  ] : [
    { title: 'Worn or loose component', score: 88, detail: 'The described symptoms fit a part that has shifted or worn with use.' },
    { title: 'Surface obstruction or buildup', score: 58, detail: 'Cleaning and a close inspection may resolve the issue.' },
    { title: 'Underlying material fatigue', score: 28, detail: 'Less likely, but worth checking if the first steps do not help.' },
  ]
  const repairCost = isTextile ? { min: 4, max: 18 } : isElectronics ? { min: 8, max: 20 } : { min: 6, max: 28 }
  const replacementCost = isTextile ? { min: 45, max: 120 } : isElectronics ? { min: 90, max: 140 } : { min: 70, max: 180 }
  return {
    summary,
    confidence: 92,
    causes,
    repairability: 'High',
    difficulty: 'Easy',
    repairCost,
    replacementCost,
    repairTime: '10–20 minutes',
    tools: ['Soft, dry cleaning brush', 'Bright flashlight', 'Original cable or screwdriver'],
    safetyWarnings: ['Unplug before inspecting.', 'Do not work on anything hot, sparking, swollen, or wet.', 'Stop and contact a professional if you see exposed wiring or damage.'],
    steps: ['Power the item off and disconnect it from any charger or power source.', 'Inspect the affected area with a bright light for debris, looseness, or visible movement.', 'Clean or gently adjust the area using the recommended tools. Do not insert metal tools.', 'Reconnect and test the item. Stop if it becomes hot, smells unusual, or behaves unpredictably.'],
    recommendation: 'Repair first. The likely repair is low cost and could extend the useful life of the item.',
    estimatedSavings: Math.max(0, Math.round(((replacementCost.min + replacementCost.max) / 2) - ((repairCost.min + repairCost.max) / 2))),
  }
}
