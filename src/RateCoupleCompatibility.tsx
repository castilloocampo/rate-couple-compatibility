import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

const RateCoupleCompatibility = () => {
  const [inputValues, setInputValues] = useState({
    name1: "",
    name2: ""
  });

  const [rate, setRate] = useState("0");

  const setPageTitle = () => {
    document.title = "Rate Couple Compatibility";
  }

  useEffect(() => {
    setPageTitle();
  }, []);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value
    });
  }

  const deleteDiacritics = (text: string) => {
    return text
      .normalize('NFD')
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1")
      .normalize();
  }

  const countChar = (str: string): number[] => {
    const counts: any = {};
    for (const s of str) {
      if (counts[s as keyof typeof counts]) {
        counts[s as keyof typeof counts]++
      } else {
        counts[s as keyof typeof counts] = 1;
      }
    }
    return Object.values(counts);
  }

  const rateCalculator = (arrayCount: Array<number>, index: number): number[] => {
    let altArray: number[] = [];
    const length = arrayCount.length - 1;
    if (arrayCount.length > 2) {
      for (let index = 0; index < (length - index); index++) {
        //Se suman los extremos
        let result: any = arrayCount[index] + arrayCount[length - index];
        if (result > 9) {
          //se descompone en cifras el numero y crea un array de dos digitos
          result = getDigits(result);
          // Se concatenan los arrays
          altArray = [...altArray, ...result];
        } else {
          //se agrega el resultado al array
          altArray.push(result);
        }
      }
      if (arrayCount.length % 2 === 1) {
        //El array tiene un numero impar de elementos
        altArray.push(arrayCount[length / 2]);
      }
      return altArray = rateCalculator(altArray, index + 1);
    }
    return (altArray.length !== 0) ? altArray : arrayCount;
  }

  const prepareStringToCalculateRate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name1, name2 } = inputValues;
    const stringNames = `${name1}${name2}`.toLowerCase();
    const stringNoSpaces = stringNames.replaceAll(" ", "");
    const stringNoDiacritics = deleteDiacritics(stringNoSpaces);
    const arrayCount = countChar(stringNoDiacritics);
    const arrayResult = rateCalculator(arrayCount, 1);
    setRate(arrayResult.join(""));
  }

  const getDigits = (num: number): number[] => {
    const digits = num.toString().split('');
    return digits.map(Number)
  }

  return (
    <div className='flex justify-center'>
      <div className='flex flex-col justify-center items-center w-2/3 h-screen bg-indigo-300 rounded-full'>
        <div className='w-2/5 bg-emerald-500 text-center rounded-xl m-8'>
          <h1 className='item-center'>Calcula la compatibilidad con tu pareja</h1>
        </div>
        <div>
          <form onSubmit={(e) => prepareStringToCalculateRate(e)}>
            <div className='flex justify-between'>
              <label >Nombre 1: </label>
              <input
                name="name1"
                onChange={handleChangeInput}
                className="border-2 border-red-600 rounded-lg" />
            </div>
            <div className='flex justify-between '>
              <label>Nombre 2: </label>
              <input
                name="name2"
                onChange={handleChangeInput}
                className="border-2 border-red-600 rounded-lg" />
            </div>
            <div className='flex justify-center'>
              <button
                className="border-4 bg-cyan-700 rounded-full p-3 text-white text-center">Calcular compatibilidad</button>
            </div>

          </form>
          <div>
            <br />
            Rate: {rate} %
          </div>

        </div>
      </div>
    </div>
  )
}

export default RateCoupleCompatibility;