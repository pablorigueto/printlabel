import React, { useState, useEffect } from "react";
import QRCode from 'qrcode.react';
import styles from './styles/print.css'
import { MdPrint, MdCloudDownload } from 'react-icons/md';
import axios from 'axios';

function App() {
  const [op, setOp] = useState('');
  const [nroGaiola, setNroGaiola] = useState('');
  const [pesoGaiola, setPesoGaiola] = useState('');
  const [pesoTotal, setPesoTotal] = useState('');
  const [codProduto, setCodProduto] = useState('');
  const [currentDate, setCurrentDate] = useState("");
  const [pesoProduto, setPesoProduto] = useState("");
  const [fila, setFila] = useState("");
  const [bloco, setBloco] = useState("");
  const [pesoLiquido, setPesoLiquido] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedDate = `${day}/${month}/${year}  -  ${hours}:${String(minutes).padStart(2, "0")}`;
    setCurrentDate(formattedDate);
  };

  const calculatePesoLiquidoAndQuantidade = () => {
    const parsedPesoGaiola = parseFloat(pesoGaiola);
    const parsedPesoTotal = parseFloat(pesoTotal);
    const calculatedPesoLiquido = (parsedPesoTotal - parsedPesoGaiola).toFixed(2);
    const parsedPesoProduto = parseFloat(pesoProduto);
    const calculatedQuantidade = (calculatedPesoLiquido / parsedPesoProduto).toFixed(2);
  
    return { calculatedPesoLiquido, calculatedQuantidade };
  };
  
  useEffect(() => {
    getCurrentDate();
  }, []);

  useEffect(() => {
    calcularPesoLiquido();
  }, [
    pesoGaiola,
    pesoTotal,
    pesoProduto,
  ]);

  const calcularPesoLiquido = () => {
    const { calculatedPesoLiquido, calculatedQuantidade } = calculatePesoLiquidoAndQuantidade();
  
    if (!isNaN(calculatedPesoLiquido)) {
      setPesoLiquido(calculatedPesoLiquido);
    }
    else {
      setPesoLiquido('');
    }
  
    if (!isNaN(calculatedQuantidade)) {
      setQuantidade(calculatedQuantidade);
    }
    else {
      setQuantidade('');
    }
  };

  const generateQRCodeData = () => {
    return `${currentDate}, ${op}, ${nroGaiola}, ${pesoGaiola}, ${pesoTotal}, ${codProduto}, ${pesoProduto}, ${fila}, ${bloco}, ${pesoLiquido}, ${quantidade}`;
  };

  const renderItemsToPrint = () => {
    return (
      <div className='toPrint'>
        <div>
          <div className="field"><label>Data/Hora:</label><span className="data"> {currentDate}</span></div>
          <div className="field"><label>OP:</label><span className="op"> {op}</span></div>
          <div className="field"><label>Nº Gaiola:</label><span> {nroGaiola}</span></div>
          <div className="field"><label>Peso Gaiola:</label><span> {pesoGaiola}</span></div>
          <div className="field"><label>Peso Total:</label><span> {pesoTotal}</span></div>
          <div className="field"><label>Cod. Produto:</label><span> {codProduto}</span></div>
          <div className="field"><label>Peso Produto:</label><span> {pesoProduto}</span></div>
          <div className="field"><label>Fila:</label><span> {fila}</span></div>
          <div className="field"><label>Bloco:</label><span> {bloco}</span></div>
          <div className="field"><label>Peso Liquido:</label><span> {pesoLiquido}</span></div>
          <div className="field"><label>Quantidade:</label><span> {quantidade}</span></div>
        </div>
        <div className="qrcode">
          <QRCode value={generateQRCodeData()} />
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    window.print();
    resetForm();
  };

  const resetForm = () => {
    setCurrentDate('');
    setOp('');
    setNroGaiola('');
    setPesoGaiola('');
    setPesoTotal('');
    setCodProduto('');
    setPesoProduto('');
    setFila('');
    setBloco('');
    setPesoLiquido('');
    setQuantidade('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    handlePrint();
  
    const data = {
      "Data": currentDate,
      "OP": op,
      "Nro da Gaiola": nroGaiola,
      "Peso da Gaiola": pesoGaiola,
      "Peso Total": pesoTotal,
      "Cod. do Produto": codProduto,
      "Peso do Produto": pesoProduto,
      "Fila": fila,
      "Bloco": bloco,
      "Peso Líquido": pesoLiquido,
      "Quantidade": quantidade,
    };
  
    try {
      const response = await axios.post('./backend/src/SaveData.php', data);
      // Response from the backend.
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

  };

  const handleDownload = () => {
    const downloadLink = document.createElement('a');
    downloadLink.href = './backend/printData.xlsx'; // Specify the path to the file
    downloadLink.download = 'printData.xlsx'; // Specify the file name
    downloadLink.click();
  };

  return (
    <>
    <div className='main_structure'>

      <div className='topHead'>
        {/* Logotipo */}
        <button className="logotipo">
        </button>

        {/* Title field */}
        <div className="title">
          <h2 className="titleH2">ETIQUETA DE ESTOQUE</h2>
        </div>

      </div>

      <div className='iniFields'>

        <div className='data__grid'>
          <label className='data__label'>Data/Hora:</label>
          <button type="button" className="data__button" onClick={getCurrentDate}>Atualizar</button>
          <input type="text" className="data__input" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} />
        </div>

        <div className='grid'>
          <label>OP:</label>
          <input type="text" value={op} onChange={(e) => setOp(e.target.value)} />
        </div>

        <div className='grid'>
          <label>Nº Gaiola:</label>
          <input type="text" value={nroGaiola} onChange={(e) => setNroGaiola(e.target.value.slice(0, 20))} maxLength={20} />
        </div>

        <div className='grid'>
          <label>Peso Gaiola:</label>
          <input type="text" value={pesoGaiola} onChange={(e) => setPesoGaiola(e.target.value)} />
        </div>

        <div className='grid'>
          <label>Peso Total:</label>
          <input type="text" value={pesoTotal} onChange={(e) => setPesoTotal(e.target.value.slice(0, 20))} maxLength={20} />
        </div>

        <div className='grid'>
          <label>Cod. Produto:</label>
          <input type="text" value={codProduto} onChange={(e) => setCodProduto(e.target.value)} />
        </div>

        <div className='grid'>
          <label>Peso do Produto:</label>
          <input type="text" value={pesoProduto} onChange={(e) => setPesoProduto(e.target.value)} />
        </div>

        <div className='grid'>
          <label>Fila:</label>
          <input type="text" value={fila} onChange={(e) => setFila(e.target.value)} />
        </div>

        <div className='grid'>
          <label>Bloco:</label>
          <input type="text" value={bloco} onChange={(e) => setBloco(e.target.value)} />
        </div>

        <div className='grid'>
          <label>Peso Líquido:</label>
          <input type="number" readOnly value={pesoLiquido} onChange={(e) => setPesoLiquido(e.target.value)} />
        </div>

        <div className='grid'>
          <label>Quantidade:</label>
          <input type="number" readOnly value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        </div>

      </div>

    </div>

    <div className="bottom_buttons">
      <div className='parentPrintBtn'>
        <button className='printBtn' onClick={handleSubmit}><MdPrint /> Imprimir</button>
      </div>  

      {/* New download button */}
      <div className="downloadButton">
        <button className="download__btn" onClick={handleDownload}>
          <MdCloudDownload /> Download
        </button>
      </div>
    </div>

    <div className='renderItemsToPrint'>{renderItemsToPrint()}</div>
    </>
  );
}

export default App;
