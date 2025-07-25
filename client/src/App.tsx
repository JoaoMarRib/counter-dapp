import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CounterABI from "./Counter.json";
import "./App.css";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contract = new ethers.Contract(contractAddress, CounterABI.abi, provider);

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. SEU NOME NO CONTRATO (2 pontos)
  const CONTRACT_NAME = "DApp Counter do João Marcos";

  // 3. NÚMERO PARA DISPARAR PARABÉNS (4 pontos)
  const CONGRATULATIONS_NUMBER = 10;

  useEffect(() => {
    async function load() {
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
      const signer = provider.getSigner();
      setSigner(signer);

      const contractWithSigner = contract.connect(signer);
      const currentCount = await contractWithSigner.getCount();
      setCount(Number(currentCount));
    }
    load();
  }, []);

  // Função para verificar se deve mostrar parabéns
  const checkCongratulations = (newCount: number) => {
    if (newCount === CONGRATULATIONS_NUMBER) {
      setShowCongrats(true);
      // Remove a mensagem depois de 4 segundos
      setTimeout(() => {
        setShowCongrats(false);
      }, 4000);
    }
  };

  const increment = async () => {
    if (!signer) return;
    try {
      setLoading(true);
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.increment();
      await tx.wait();
      const newCount = await contractWithSigner.getCount();
      const countNumber = Number(newCount);
      setCount(countNumber);
      
      // 3. VERIFICAR PARABÉNS (4 pontos)
      checkCongratulations(countNumber);
    } catch (error) {
      console.error("Erro ao incrementar:", error);
      alert("Erro ao incrementar o contador!");
    } finally {
      setLoading(false);
    }
  };

  const decrement = async () => {
    if (!signer) return;
    try {
      setLoading(true);
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.decrement();
      await tx.wait();
      const newCount = await contractWithSigner.getCount();
      setCount(Number(newCount));
    } catch (error) {
      console.error("Erro ao decrementar:", error);
      alert("Erro: Não é possível decrementar abaixo de zero!");
    } finally {
      setLoading(false);
    }
  };

  // 2. FUNÇÃO PARA ZERAR O CONTADOR (4 pontos)
  const reset = async () => {
    if (!signer) return;
    try {
      setLoading(true);
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.reset();
      await tx.wait();
      const newCount = await contractWithSigner.getCount();
      setCount(Number(newCount));
      
      // Remove mensagem de parabéns se estiver mostrando
      setShowCongrats(false);
    } catch (error) {
      console.error("Erro ao zerar:", error);
      alert("Erro ao zerar o contador!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* 1. NOME NO CONTRATO (2 pontos) */}
      <h1>{CONTRACT_NAME}</h1>
      
      <div className="account-info">
        <p><strong>Conta:</strong> {account}</p>
      </div>

      <div className="counter-section">
        <div className="counter-display">
          <h2>Contador: {count}</h2>
        </div>

        {/* 3. MENSAGEM DE PARABÉNS (4 pontos) */}
        {showCongrats && (
          <div className="congratulations">
            <h2>🎉 PARABÉNS! 🎉</h2>
            <p>Você chegou a {CONGRATULATIONS_NUMBER} incrementos!</p>
            <p>Excelente trabalho! 🚀</p>
          </div>
        )}

        <div className="buttons">
          <button 
            onClick={decrement} 
            disabled={loading || count === 0}
            className="btn btn-decrement"
          >
            {loading ? "⏳" : "➖ Decrementar"}
          </button>

          <button 
            onClick={increment} 
            disabled={loading}
            className="btn btn-increment"
          >
            {loading ? "⏳" : "➕ Incrementar"}
          </button>

          {/* 2. BOTÃO PARA ZERAR (4 pontos) */}
          <button 
            onClick={reset} 
            disabled={loading}
            className="btn btn-reset"
          >
            {loading ? "⏳" : "🔄 Zerar Contador"}
          </button>
        </div>

        <div className="info">
          <p>💡 Dica: Chegue a {CONGRATULATIONS_NUMBER} incrementos para uma surpresa!</p>
        </div>
      </div>
    </div>
  );
};

export default App;