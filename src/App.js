import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import QRCode from "qrcode.react";
import EtiquetaForm from "./Form/EtiquetaForm";
import styles from "./styles/print.css";

function App() {
  const [dataOperacao, setDataOperacao] = useState("");
  const [oPNumber, setOPNumber] = useState("");
  const [nroGaiola, setNroGaiola] = useState("");
  const [pesoGaiola, setPesoGaiola] = useState("");
  const [pesoTotal, setPesoTotal] = useState("");
  const [codProduto, setCodProduto] = useState("");
  const [pesoProduto, setPesoProduto] = useState("");
  const [pesoLiquido, setPesoLiquido] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [qrCodeValue, setQRCodeValue] = useState("");
  const [shouldPrint, setShouldPrint] = useState(false);

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
  
    setPesoLiquido(calculatedPesoLiquido);
    setQuantidade(calculatedQuantidade);
  };
  
  const generateQRCodeData = () => {
    const { calculatedPesoLiquido, calculatedQuantidade } = calculatePesoLiquidoAndQuantidade();

    const jsonData = {
      dataOperacao,
      oPNumber,
      nroGaiola,
      pesoGaiola,
      pesoTotal,
      codProduto,
      pesoProduto,
      pesoLiquido: calculatedPesoLiquido,
      quantidade: calculatedQuantidade,
    };

    const texto_livre = `${dataOperacao} ${oPNumber} ${nroGaiola} ${pesoGaiola} ${pesoTotal} ${codProduto} ${pesoProduto} ${calculatedPesoLiquido} ${calculatedQuantidade}`;
  
    return `${texto_livre}\n\n${JSON.stringify(jsonData, null, 2)}`;

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

  const handleSubmit = (event) => {
    setShouldPrint(true);
    updateQrCode(event);
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

  return (
    <>
      <div className="main__content">
        {/* Title field */}
        <div className="title printTitle">
          <h2 className="title__h2">ETIQUETA DE ESTOQUE</h2>
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
        {/* Update QR Code */}
        <div className="printParent">
          <div className="printButton">
            <input
              type="button"
              value="update QR Code"
              className="print__btn"
              onClick={updateQrCode}
            />
          </div>
        </div>

        {/* Print button */}
        <div className="printParent">
          <div className="printButton">
            <input
              type="submit"
              value="Imprimir"
              className="print__btn"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
