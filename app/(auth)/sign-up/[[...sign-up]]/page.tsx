import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#090d14] flex items-center justify-center px-4 py-16">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: '#6ee7d0',
            colorBackground: '#0f1623',
            colorText: '#e4def6',
            colorTextSecondary: '#9b93b8',
            colorInputBackground: '#1a2235',
            colorInputText: '#e4def6',
            borderRadius: '0.75rem',
            fontFamily: 'var(--font-jost), sans-serif',
          },
          elements: {
            rootBox: 'w-full max-w-md',
            card: 'bg-[#0f1623] border border-white/10 shadow-2xl rounded-2xl',
            headerTitle: 'font-serif text-2xl text-[#e4def6]',
            headerSubtitle: 'text-[#9b93b8] text-sm',
            formButtonPrimary:
              'bg-teal-400/20 hover:bg-teal-400/30 text-teal-300 border border-teal-400/30 rounded-full px-6 py-2 transition-all duration-200',
            formFieldInput:
              'bg-[#1a2235] border-white/10 text-[#e4def6] placeholder-[#9b93b8] focus:border-teal-400/50 rounded-xl',
            formFieldLabel: 'text-[#9b93b8] text-sm font-medium',
            footerActionLink: 'text-teal-400 hover:text-teal-300',
            dividerLine: 'bg-white/10',
            dividerText: 'text-[#9b93b8]',
            socialButtonsBlockButton:
              'border border-white/10 bg-[#1a2235] hover:bg-[#243050] text-[#e4def6] rounded-xl transition-all duration-200',
          },
          layout: {
            socialButtonsPlacement: 'bottom',
          },
        }}
      />
    </div>
  )
}
