import { MdOutlineRealEstateAgent, MdSupportAgent } from "react-icons/md";
import { TbMapSearch } from "react-icons/tb";
import { AiFillFormatPainter } from "react-icons/ai";
import { GoChecklist } from "react-icons/go";
import { GiReceiveMoney } from "react-icons/gi";

const About = () => {
  return (
    // About section on Home
    <section className="bg-[#F5F8FA] md:py-16 px-4 mx-auto">
      <div className="max-w-7xl w-full mx-auto text-primary">
        <div>
          <p className="text-gray-500 text-lg text-center font-normal pb-3">
            WHY CHOOSE US
          </p>
          <h1 className="xl:text-4xl text-3xl text-center text-gray-800 font-extrabold pb-6 sm:w-4/6 w-5/6 mx-auto">
            6 Reasons to Choose LeasHome
          </h1>
          <p className="text-center">
            Create a free account and manage your properties online
          </p>
        </div>
        <div className="grid grid-cols-1 justify-center sm:grid-cols-2 lg:grid-cols-3">
          {/* About cards */}
          <div className="max-w-sm mx-auto dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center mt-8">
            <div className="p-4">
              <div className="bg-secondary bg-opacity-80 w-12 h-12 absolute rounded-full"></div>
              <GoChecklist className="text-5xl relative left-6 font-thin" />
            </div>
            <a href="#">
              <h5 className="mb-2 text-xl text-center font-semibold tracking-tight text-gray-900 dark:text-white">
                Cooper Index 
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-500 dark:text-gray-400 text-center">
              We assess your creditworthiness without checking BIK.
            </p>
          </div>

          <div className="max-w-sm mx-auto dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center mt-8">
            <div className="p-4">
              <div className="bg-secondary bg-opacity-80 w-12 h-12 absolute rounded-full"></div>
              <MdOutlineRealEstateAgent className="text-5xl relative left-6 font-thin" />
            </div>
            <a href="#">
              <h5 className="mb-2 text-xl text-center font-semibold tracking-tight text-gray-900 dark:text-white">
                Transparency and safety
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-500 dark:text-gray-400 text-center">
              Our agents are experienced and understanding experts who deliver
              fresh and effective solutions.
            </p>
          </div>

          <div className="max-w-sm mx-auto dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center mt-8">
            <div className="p-4">
              <div className="bg-secondary bg-opacity-80 w-12 h-12 absolute rounded-full"></div>
              <GiReceiveMoney className="text-5xl relative left-6 font-thin" />
            </div>
            <a href="#">
              <h5 className="mb-2 text-xl text-center font-semibold tracking-tight text-gray-900 dark:text-white">
              Long-term offers with buyout options
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-500 dark:text-gray-400 text-center">
              We offer long-term offers with buyout options for our clients.
            </p>
          </div>

          <div className="max-w-sm mx-auto dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center mt-8">
            <div className="p-4">
              <div className="bg-secondary bg-opacity-80 w-12 h-12 absolute rounded-full"></div>
              <TbMapSearch className="text-5xl relative left-6 font-thin" />
            </div>
            <a href="#">
              <h5 className="mb-2 text-xl text-center font-semibold tracking-tight text-gray-900 dark:text-white">
                Knowledge base and contract templates
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-500 dark:text-gray-400 text-center">
              With LeasHome, you can search for a desired property from any
              location.
            </p>
          </div>

          <div className="max-w-sm mx-auto dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center mt-8">
            <div className="p-4">
              <div className="bg-secondary bg-opacity-80 w-12 h-12 absolute rounded-full"></div>
              <AiFillFormatPainter className="text-5xl relative left-6 font-thin" />
            </div>
            <a href="#">
              <h5 className="mb-2 text-xl text-center font-semibold tracking-tight text-gray-900 dark:text-white">
                Well-furnished Interiors
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-500 dark:text-gray-400 text-center">
              All our properties are furnished and decorated to meet your needs
              and expectations.
            </p>
          </div>

          <div className="max-w-sm mx-auto dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center mt-8">
            <div className="p-4">
              <div className="bg-secondary bg-opacity-80 w-12 h-12 absolute rounded-full"></div>
              <MdSupportAgent className="text-5xl relative left-6 font-thin" />
            </div>
            <a href="#">
              <h5 className="mb-2 text-xl text-center font-semibold tracking-tight text-gray-900 dark:text-white">
                Get support when you need it
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-500 dark:text-gray-400 text-center">
              LeasHome support experts are always ready to help you and answer
              your questions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
