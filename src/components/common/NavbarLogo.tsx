import logo from '@/assets/logo.svg'
import logoDotGreen from '@/assets/logo-dot-green.svg'

export default function NavbarLogo() {
  return (
    <div className="flex items-center gap-[9px]">
      <img src={logo} alt="" className="h-[21.3px] w-[26.7px]" />
      <div className="flex flex-col">
        <div className="flex">
          <span className="font-brand text-[17px] leading-[17px] font-bold tracking-[-0.9px] text-white">
            ASK
          </span>
          <span className="font-brand text-[17px] leading-[17px] font-light tracking-[-0.9px] text-white">
            eep
          </span>
        </div>
        <span className="text-line mt-0.5 flex items-center gap-[2.85px] text-[6.6px] font-medium">
          GDGoC SMU
          <i className="size-[3.79px] rounded-full bg-[#4285f4]" />
          <i className="size-[3.79px] rounded-full bg-[#ea4335]" />
          <i className="size-[3.79px] rounded-full bg-[#fbbc04]" />
          <img src={logoDotGreen} alt="" className="size-[3.79px]" />
        </span>
      </div>
    </div>
  )
}
