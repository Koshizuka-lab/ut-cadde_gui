import { NextPage } from "next";
import { Header } from '@/containers/Header'

const Page: NextPage = () => {
  return <>
    <Header />
    <div className="flex justify-center items-center w-full h-screen bg-form">
      <div className="bg-white">
        <div className="flex flex-col justify-center items-center pt-10 px-20 pb-2">
          <div className="text-3xl text-primary font-bold font-inter">
            Sign In
          </div>
          <div className="flex flex-col justify-left w-72 pt-5">
            <div className="text-md font-inter">DATA-EX ID</div>
            <input
              className="bg-form border-b border-secondary w-full h-10"
              type="text"
            />
          </div>
          <div className="flex flex-col justify-left w-72 pt-5">
            <div className="text-md font-inter">Password</div>
            <input 
              className="bg-form border-b border-secondary w-full h-10"
              type="password"
            />
            <div className="flex flex-row justify-end">
              <div className="text-primary font-inter text-sm pt-2 underline">
                Forgot password?
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center py-10">
            <button className="bg-primary text-white w-48 h-10 font-inter font-bold">
              Sign In
            </button>
          </div>
          <div className="text-primary font-inter text-sm">
            Don't have DATA-EX ID? <a className="text-primary underline">Create one</a>
          </div>
        </div>
      </div>
    </div>
  </>;
}

export default Page