import { NextResponse } from 'next/server'

// Email regex according to HTML5 / RFC 5322 validation standard
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export async function POST(request: Request) {
  try {
    let email = ''

    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      email = typeof body?.email === 'string' ? body.email.trim() : ''
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const emailField = formData.get('email')
      email = typeof emailField === 'string' ? emailField.trim() : ''
    } else {
      const text = await request.text()
      try {
        const parsed = JSON.parse(text)
        email = typeof parsed?.email === 'string' ? parsed.email.trim() : ''
      } catch {
        email = text.trim()
      }
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      )
    }

    if (email.length > 254 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // In a production app, here you would persist to a database or forward to Mailchimp/Resend/SendGrid/etc.
    // For this portfolio, we acknowledge and return a success response.
    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to my newsletter!',
      email,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Unable to process subscription. Please try again later.' },
      { status: 500 }
    )
  }
}
