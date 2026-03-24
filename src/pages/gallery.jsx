import { memo, useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { useParams } from "react-router-dom";
import { fetchOneProgram } from '../services/api';
import { PacmanLoader } from "react-spinners";


const Gallery = () => {
  const { id } = useParams();
  const [color, setColor] = useState("#101111ff");
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState(false)
  const [tempImg, setTempImg] = useState('')
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "white",
  };
  useEffect(() => {
    const loadProgram = async () => {
      try {
        const result = await fetchOneProgram(id);
        setProgram(result.data);
      } catch (error) {
        console.error("Error loading gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProgram();
  }, [id]);

  const getImg = (img) => {
    setTempImg(img)
    setModel(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen sweet-loading flex items-center justify-center">
        <PacmanLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={70}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    )
  }

  if (!program) return <div className="min-h-screen flex items-center justify-center">Program not found</div>;

  const data = program.images.map((img, index) => ({
    id: index,
    img
  }));

  return (
    <>
      <div className={model ? "model open " : "model"}>
        <img src={tempImg} alt="" />
        <span>
          <HiX onClick={() => setModel(false)} />
        </span>
      </div>

      <div className="py-16 px-4 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-barlow font-bold uppercase italic text-gray-800 tracking-tight">
            {program.title}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="w-8 h-0.5 bg-blue-600"></span>
            <p className="text-blue-600 font-zentry uppercase tracking-widest text-sm font-semibold">Gallery Collection</p>
            <span className="w-8 h-0.5 bg-blue-600"></span>
          </div>
        </div>

        <div className='gallery'>
          {data.map((item, index) => {
            return (
              <div className='pics'
                key={index}
                onClick={() => getImg(item.img)}
              >
                <img src={item.img}
                  alt=""
                  className='w-full'
                />
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
};


export default memo(Gallery);
