import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import EtiquetaForm from "./Form/EtiquetaForm";
import styles from "./styles/print.css";
import { MdSettings, MdPrint, MdCloudDownload } from 'react-icons/md';
import axios from 'axios';

function App() {
  const [dataOperacao, setDataOperacao] = useState("");
  const [oPNumber, setOPNumber] = useState("");
  const [nroGaiola, setNroGaiola] = useState("");
  const [pesoGaiola, setPesoGaiola] = useState("");
  const [pesoTotal, setPesoTotal] = useState("");
  const [codProduto, setCodProduto] = useState("");
  const [pesoProduto, setPesoProduto] = useState("");

  const [fila, setFila] = useState("");
  const [bloco, setBloco] = useState("");

  const [pesoLiquido, setPesoLiquido] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [qrCodeValue, setQRCodeValue] = useState("");
  const [shouldPrint, setShouldPrint] = useState(false);
  const [printSize, setPrintSize] = useState("10cm 5cm");


  useEffect(() => {
    const handleBeforePrint = () => {
      const title = document.querySelector(".title h2");
      const printingInput = document.querySelector(".printButton");
      if (printingInput) {
        printingInput.style.display = "none";
        title.style.display = "none";
      }
    };

    const handleAfterPrint = () => {
      const title = document.querySelector(".title h2");
      const printingInput = document.querySelector(".printButton");
      if (printingInput) {
        printingInput.style.display = "block";
        title.style.display = "block";
      }
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  const calculatePesoLiquidoAndQuantidade = () => {
    const parsedPesoGaiola = parseFloat(pesoGaiola);
    const parsedPesoTotal = parseFloat(pesoTotal);
    const calculatedPesoLiquido = (parsedPesoTotal - parsedPesoGaiola).toFixed(2);
    const parsedPesoProduto = parseFloat(pesoProduto);
    const calculatedQuantidade = (calculatedPesoLiquido / parsedPesoProduto).toFixed(2);
  
    return { calculatedPesoLiquido, calculatedQuantidade };
  };
  
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
    const { calculatedPesoLiquido, calculatedQuantidade } = calculatePesoLiquidoAndQuantidade();

    const texto_livre = `${dataOperacao}\t  ${oPNumber}\t ${nroGaiola}\t  ${pesoGaiola}\t ${pesoTotal}\t  ${codProduto}\t ${pesoProduto}\t  ${fila}\t  ${bloco}\t  ${calculatedPesoLiquido}\t  ${calculatedQuantidade}`;

    return texto_livre;

  };
  
  useEffect(() => {
    if (qrCodeValue !== '' && shouldPrint) {
      window.print();
      setShouldPrint(false);
    }
  }, [qrCodeValue, shouldPrint]);

  const updateQrCode = (event) => {
    event.preventDefault();
    const qrCodeData = generateQRCodeData();
    setQRCodeValue(qrCodeData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShouldPrint(true);
    updateQrCode(event);
  
    const data = {
      "Data": dataOperacao,
      "OP": oPNumber,
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

  useEffect(() => {
    calcularPesoLiquido();
  }, [
    dataOperacao,
    oPNumber,
    nroGaiola,
    pesoGaiola,
    pesoTotal,
    codProduto,
    pesoProduto,
  ]);

  useEffect(() => {
    const printStyles = `
      @media print {
        @page {
          size: ${printSize};
          margin: 0;
          padding: 0;
        }
      }
    `;

    // Add the printStyles to the <style> tag
    const styleElement = document.createElement("style");
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);
  }, [printSize]);

  const handlePrintSizeChange = () => {
    const newSize = prompt("Digite o tamanho desejado para imprimir ex: 10cm 5cm");
    setPrintSize(newSize);
  };

  return (
    <>
      <div className="main__content">

         <div className="printSizeParent">

          {/* Title field */}
          <div className="title printTitle">
            <h2 className="title__h2">ETIQUETA DE ESTOQUE</h2>
          </div>

          {/* Change print size button */}
          <button className="printSize"
            onClick={handlePrintSizeChange}>
            <MdSettings />
          </button>

         </div>

        {/* Parent fields and QR Code */}
        <div className="parent">
          {/* Form fields */}
          <div className="fields">
            <EtiquetaForm
              setDataOperacao={setDataOperacao}
              setOPNumber={setOPNumber}
              setNroGaiola={setNroGaiola}
              setPesoGaiola={setPesoGaiola}
              setPesoTotal={setPesoTotal}
              setCodProduto={setCodProduto}
              setPesoProduto={setPesoProduto}
              calcularPesoLiquido={calcularPesoLiquido}
              setFila={setFila}
              setBloco={setBloco}
              pesoLiquido={pesoLiquido}
              quantidade={quantidade}
            />
          </div>

          {/* QR Code Field */}
          <div className="qrcode__field">
            <QRCode key={qrCodeValue} value={qrCodeValue} className="qrcode" />
          </div>
        </div>
      </div>

      <div className="buttons">

        {/* Print button */}
        <div className="printParent">
          <div className="printButton">
          
            <button
              className="print__btn"
              onClick={handleSubmit}
            >
            <MdPrint /> Imprimir
            </button>
          </div>
        </div>

        {/* New download button */}
        <div className="downloadButton">
          <button className="download__btn" onClick={handleDownload}>
            <MdCloudDownload /> Download
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
