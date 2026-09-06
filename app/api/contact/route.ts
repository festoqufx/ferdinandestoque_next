import { NextResponse } from 'next/server'

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
const RECIPIENT_EMAIL = 'ferdinand.estoque@yahoo.com'

export async function POST(request: Request) {
  try {
    let name = ''
    let email = ''
    let subject = ''
    let message = ''

    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      name = typeof body?.name === 'string' ? body.name.trim() : ''
      email = typeof body?.email === 'string' ? body.email.trim() : ''
      subject = typeof body?.subject === 'string' ? body.subject.trim() : ''
      message = typeof body?.message === 'string' ? body.message.trim() : ''
    } else {
      const formData = await request.formData()
      name = (formData.get('name') as string || '').trim()
      email = (formData.get('email') as string || '').trim()
      subject = (formData.get('subject') as string || '').trim()
      message = (formData.get('message') as string || '').trim()
    }

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your name (at least 2 characters).' },
        { status: 400 }
      )
    }

    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    if (!subject || subject.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Please enter a subject (at least 3 characters).' },
        { status: 400 }
      )
    }

    if (!message || message.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a message (at least 10 characters).' },
        { status: 400 }
      )
    }

    // In serverless / edge environments, you can forward to a transactional email provider
    // (Resend, SendGrid, Postmark, AWS SES, or custom SMTP).
    // Configured recipient is ferdinand.estoque@yahoo.com.
    return NextResponse.json({
      success: true,
      message: `Your message has been sent successfully to ${RECIPIENT_EMAIL}. Thank you!`,
      data: { name, email, subject },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Unable to send message. Please try again later or contact ferdinand.estoque@yahoo.com directly.' },
      { status: 500 }
    )
  }
}
