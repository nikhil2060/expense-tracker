import { useEffect, useState } from "react";
import "./App.css";
import { UserSwitch } from "@phosphor-icons/react";

// const transactionData = [];

export default function App() {
  const [transactions, setTransactions] = useState(function () {
    const storedVal = localStorage.getItem("transactions");
    return JSON.parse(storedVal) || [];
  });

  const [monthlyBudget, setMonthlyBudget] = useState(function () {
    const storedVal = localStorage.getItem("monthlyBudget");
    return JSON.parse(storedVal) || 0;
  });

  const [balance, setbalance] = useState(function () {
    const storedVal = localStorage.getItem("balance");
    return JSON.parse(storedVal) || 0;
  });

  const [expense, setexpense] = useState(function () {
    const storedVal = localStorage.getItem("expense");
    return JSON.parse(storedVal) || 0;
  });

  const translen = transactions.length;

  useEffect(
    function () {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    },
    [transactions]
  );

  useEffect(
    function () {
      localStorage.setItem("monthlyBudget", JSON.stringify(monthlyBudget));
    },
    [monthlyBudget]
  );

  useEffect(
    function () {
      localStorage.setItem("balance", JSON.stringify(balance));
    },
    [balance]
  );

  useEffect(
    function () {
      localStorage.setItem("expense", JSON.stringify(expense));
    },
    [expense]
  );

  function handleAddTranctions(transaction) {
    if (transaction.type === "expense") {
      setexpense(+expense + parseInt(transaction.amount));
    } else {
      setbalance(+balance + parseInt(transaction.amount));
    }

    setTransactions([...transactions, transaction]);
  }

  function handleReset() {
    setMonthlyBudget(0);
    setTransactions([]);
    setbalance(0);
    setexpense(0);
    localStorage.clear();
  }

  return (
    <div className="app">
      <h1>EXPENSE TRACKER</h1>
      <DashBoard
        setMonthlyBudget={setMonthlyBudget}
        setbalance={setbalance}
        balance={balance - expense}
        monthlyBudget={monthlyBudget}
        expense={expense}
        onReset={handleReset}
      />
      {translen > 0 && <ExpenseList transactions={transactions} />}
      {balance > 0 && (
        <AddTransactionForm addTransaction={handleAddTranctions} />
      )}
    </div>
  );
}

function DashBoard({
  setbalance,
  setMonthlyBudget,
  balance,
  monthlyBudget,
  expense,
  onReset,
}) {
  const [budget, setBudget] = useState(0);

  function handleBudgetSubmit(e) {
    e.preventDefault();
    setMonthlyBudget(budget);
    setbalance(budget);
    setBudget(0);
  }

  return (
    <div className="dashboard-container">
      <div className="budget-container">
        <form className="budget" onSubmit={handleBudgetSubmit}>
          <div className="budget-title">
            <p>
              {monthlyBudget === 0 ? "Set Monthly Budget" : "Monthly Budget"}
            </p>
            <button onClick={onReset}>
              <UserSwitch size={20} color="#4A55A2" weight="bold" />
            </button>
          </div>

          {monthlyBudget === 0 && (
            <input type="text" onChange={(e) => setBudget(e.target.value)} />
          )}

          {monthlyBudget > 0 && <span>{monthlyBudget}</span>}
        </form>
      </div>

      {monthlyBudget > 0 && (
        <div className="budget-container">
          <div className="budget margin-top">
            <div className="budget-title">
              <p>Balance</p>
            </div>

            <span>{balance}</span>
          </div>
        </div>
      )}

      {monthlyBudget > 0 && (
        <div className="budget-container">
          <div className="budget margin-top">
            <div className="budget-title">
              <p>Expense</p>
            </div>

            <span>{expense}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ExpenseList({ transactions }) {
  return (
    <div className="expense-list-container">
      <h1>Transactions</h1>
      <ul>
        {transactions.map((item) => (
          <ListItem item={item} />
        ))}
      </ul>
    </div>
  );
}

function ListItem({ item }) {
  return (
    <li className="list-item">
      <span>{item.name}</span>
      <div>
        <p>{item.date}</p>
        <p
          className={
            item.type === "income" ? "list-item-green" : "list-item-red"
          }
        >
          ₹ {Math.abs(item.amount)}
        </p>
      </div>
    </li>
  );
}

function AddTransactionForm({ addTransaction }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !amount) return;

    const id = crypto.randomUUID();
    const newTransaction = {
      id,
      date: formattedDate,
      name,
      type,
      amount: amount,
    };

    addTransaction(newTransaction);

    setName("");
    setAmount("");
    setType("");

    console.log(newTransaction);
  }

  return (
    <div className="form-container" onSubmit={handleSubmit}>
      <h1>Add Transactions</h1>
      <form className="transaction-form">
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            placeholder="Food"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            placeholder="₹ 0"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Select</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label>Click to add</label>
          <button>Add</button>
        </div>
      </form>
    </div>
  );
}
