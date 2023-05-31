import React, { useState } from 'react';
import styles from "../styles/print.css";

function EtiquetaForm({
  handleSubmit,
  setDataOperacao,
  nroGaiola,
  setNroGaiola,
  oPNumber,
  setOPNumber,
  pesoGaiola,
  setPesoGaiola,
  pesoTotal,
  setPesoTotal,
  codProduto,
  setCodProduto,
  calcularPesoLiquido,
  pesoProduto,
  setPesoProduto,
  pesoLiquido,
  quantidade,
  setQuantidade,
  fila,  // Use the value from props
  setFila,
  bloco,  // Use the value from props
  setBloco,
}) {
  const [currentDate, setCurrentDate] = useState("");

  const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    setCurrentDate(formattedDate);
    setDataOperacao(formattedDate);
  };

  return (
    <>
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form__field">
          <label htmlFor="data">Data:</label>
          <button
            type="button"
            className="button__currentDate"
            onClick={getCurrentDate}
          >
            Data Atual
          </button>

          <input
            type="text"
            id="data"
            name="data"
            required
            placeholder="dia/mes/ano"
            className="input__data input__field"
            value={currentDate}
            onChange={(e) => setDataOperacao(e.target.value)}
          />

        </div>

        <div className="form__field">
          <label htmlFor="op">OP:</label>
          <input type="text"
            id="op"
            name="op"
            required
            className="input__user input__field"
            value={oPNumber}
            onChange={(e) => setOPNumber(e.target.value)}
          />
        </div>

        <div className="form__field">
          <label htmlFor="numero_gaiola">Nro da Gaiola:</label>
          <input
            type="text"
            id="numero_gaiola"
            name="numero_gaiola"
            required
            className="input__user input__field"
            value={nroGaiola}
            onChange={(e) => setNroGaiola(e.target.value)}
          />
        </div>

        <div className="form__field">
          <label htmlFor="peso_gaiola">Peso da Gaiola:</label>
          <input
            type="text"
            id="peso_gaiola"
            name="peso_gaiola"
            required
            value={pesoGaiola}
            onChange={(e) => setPesoGaiola(e.target.value)}
            onInput={calcularPesoLiquido}
            className="input__user input__field"
          />
        </div>

        <div className="form__field">
          <label htmlFor="peso_total">Peso Total:</label>
          <input
            type="text"
            id="peso_total"
            name="peso_total"
            required
            value={pesoTotal}
            onChange={(e) => setPesoTotal(e.target.value)}
            onInput={calcularPesoLiquido}
            className="input__user input__field"
          />
        </div>

        <div className="form__field">
          <label htmlFor="cod_produto">Cod. do Produto:</label>
          <input
            type="text"
            id="cod_produto"
            name="cod_produto"
            required
            className="input__user input__field"
            value={codProduto}
            onChange={(e) => setCodProduto(e.target.value)}
          />
        </div>

        <div className="form__field">
          <label htmlFor="peso_produto">Peso do Produto:</label>
          <input
            type="text"
            id="peso_produto"
            name="peso_produto"
            required
            
            className="input__user input__field"
            value={pesoProduto}
            onChange={(e) => setPesoProduto(e.target.value)}
            onInput={calcularPesoLiquido}
            />
        </div>

        <div className="form__field">
            <label htmlFor="fila">Fila:</label>
            <input
              type="text"
              id="fila"
              name="fila"
              required
              className="input__user input__field"
              value={fila}  // Use the value from props
              onChange={(e) => setFila(e.target.value)}
            />
          </div>

          <div className="form__field">
            <label htmlFor="bloco">Bloco:</label>
            <input
              type="text"
              id="bloco"
              name="bloco"
              required
              className="input__user input__field"
              value={bloco}  // Use the value from props
              onChange={(e) => setBloco(e.target.value)}
            />
          </div>

 

        <div className="form__field">
          <label htmlFor="peso_liquido">Peso Liquido:</label>
          <input
            type="text"
            id="peso_liquido"
            name="peso_liquido"
            className="input__user} input__field"
            value={pesoLiquido}
            onChange={(e) => setPesoProduto(e.target.value)}
          />
        </div>

        <div className="form__field">
          <label htmlFor="quantidade">Quantidade:</label>
          <input
            type="text"
            id="quantidade"
            name="quantidade"
            className="input__user} input__field"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            />
        </div>
      </form>
    </div>
    </>
  )
}

export default EtiquetaForm;
