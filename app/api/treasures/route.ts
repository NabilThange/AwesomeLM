import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Upload a single file/base64 to Supabase Storage bucket 'treasures'
async function uploadImageToStorage(fileOrUrl: string): Promise<string> {
  if (!fileOrUrl) return '/default-placeholder.png'
  if (fileOrUrl.startsWith('http://') || fileOrUrl.startsWith('https://') || fileOrUrl.startsWith('/')) {
    return fileOrUrl
  }

  // Handle base64 data URLs
  const matches = fileOrUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/)
  if (!matches) {
    throw new Error('Invalid image format. Expected base64 data URL or HTTP link.')
  }

  const mimeType = matches[1]
  const base64Data = matches[2]
  const buffer = Buffer.from(base64Data, 'base64')
  
  const ext = mimeType.split('/')[1] || 'png'
  const fileName = `user_uploads/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`

  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/treasures/${fileName}`
  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY!,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': mimeType,
      'x-upsert': 'true'
    },
    body: buffer
  })

  if (!uploadRes.ok) {
    const errText = await uploadRes.text()
    console.error('Storage upload failed:', uploadRes.status, errText)
    throw new Error(`Failed to upload image to storage (${uploadRes.status}): ${errText}`)
  }

  return `${SUPABASE_URL}/storage/v1/object/public/treasures/${fileName}`
}

// Handle image array (max 4)
async function processImages(images: string[]): Promise<{ main_image_url: string; additional_images: string[] }> {
  const validImages = (images || []).filter(Boolean).slice(0, 4)
  if (validImages.length === 0) {
    return { main_image_url: '/default-placeholder.png', additional_images: [] }
  }

  const uploadedUrls = await Promise.all(validImages.map(img => uploadImageToStorage(img)))
  return {
    main_image_url: uploadedUrls[0] || '/default-placeholder.png',
    additional_images: uploadedUrls.slice(1)
  }
}

/**
 * POST /api/treasures
 * Create new user prompt
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, prompt, author_name, author_link, images } = body

    if (!title || !description || !prompt) {
      return NextResponse.json({ error: 'Title, description, and prompt are required.' }, { status: 400 })
    }

    const { main_image_url, additional_images } = await processImages(images)

    const newTreasure = {
      title: title.trim(),
      description: description.trim(),
      prompt: prompt.trim(),
      main_image_url,
      additional_images,
      tags: body.tags || [],
      category: body.category || 'User Submitted',
      metadata: {
        author_name: author_name?.trim() || 'Anonymous',
        author_link: author_link?.trim() || ''
      }
    }

    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/treasures`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY!,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(newTreasure)
    })

    if (!dbRes.ok) {
      const errText = await dbRes.text()
      console.error('Database insert failed:', dbRes.status, errText)
      return NextResponse.json({ error: 'Failed to save prompt to database.' }, { status: 500 })
    }

    const insertedData = await dbRes.json()
    return NextResponse.json({ success: true, data: insertedData[0] }, { status: 201 })
  } catch (error: any) {
    console.error('API POST error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
