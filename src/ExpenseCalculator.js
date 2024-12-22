import React, { useState, useEffect } from 'react';
import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";
import { Label } from "/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "/components/ui/select";
import Chart from 'chart.js/auto'; // Import Chart.js for visualizations

const ExpenseCalculator = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState(0);
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const [newExpenseDate, setNewExpenseDate] = useState(new Date());
  const [newExpenseDescription, setNewExpenseDescription] = useState('');
  const [totalExpense, setTotalExpense] = useState(0);
  const [categories, setCategories] = useState([
    'Food', 'Transportation', 'Entertainment', 'Shopping', 'Rent', 'Utilities', 'Other'
  ]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateRange, setFilterDateRange] = useState({ from: '', to: '' });

  const handleAddExpense = () => {
    if (!newExpenseName || !newExpenseAmount || !newExpenseCategory || !newExpenseDescription) {
      alert("All fields must be filled!");
      return;
    }

    const newExpense = {
      name: newExpenseName,
      amount: newExpenseAmount,
      category: newExpenseCategory,
      date: newExpenseDate,
      description: newExpenseDescription,
    };

    setExpenses([...expenses, newExpense]);
    setTotalExpense(totalExpense + newExpenseAmount);
    setNewExpenseName('');
    setNewExpenseAmount(0);
    setNewExpenseCategory('');
    setNewExpenseDate(new Date());
    setNewExpenseDescription('');
  };

  const generateSummary = () => {
    const categorySummary = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) acc[expense.category] = 0;
      acc[expense.category] += expense.amount;
      return acc;
    }, {});

    const labels = Object.keys(categorySummary);
    const data = Object.values(categorySummary);

    const ctx = document.getElementById('expenseChart');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#57FF33', '#5733FF', '#FFC300'],
        }]
      },
    });
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filterCategory && expense.category !== filterCategory) {
      return false;
    }

    const expenseDate = expense.date.toISOString().split('T')[0];
    if (filterDateRange.from && expenseDate < filterDateRange.from) {
      return false;
    }
    if (filterDateRange.to && expenseDate > filterDateRange.to) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Expense Calculator</h1>

      {/* Expense Input Form */}
      <form className="flex flex-col mb-4">
        <Label className="text-lg font-bold mb-2" htmlFor="expense-name">Expense Name:</Label>
        <Input
          type="text"
          value={newExpenseName}
          onChange={(e) => setNewExpenseName(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg mb-4"
          id="expense-name"
        />
        
        <Label className="text-lg font-bold mb-2" htmlFor="expense-amount">Expense Amount:</Label>
        <Input
          type="number"
          value={newExpenseAmount}
          onChange={(e) => setNewExpenseAmount(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded-lg mb-4"
          id="expense-amount"
        />
        
        <Label className="text-lg font-bold mb-2" htmlFor="expense-category">Expense Category:</Label>
        <Select value={newExpenseCategory} onChange={(e) => setNewExpenseCategory(e.target.value)}>
          <SelectTrigger className="w-full p-2 border border-gray-300 rounded-lg mb-4">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Label className="text-lg font-bold mb-2" htmlFor="expense-description">Description:</Label>
        <Input
          type="text"
          value={newExpenseDescription}
          onChange={(e) => setNewExpenseDescription(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg mb-4"
          id="expense-description"
        />
        
        <Label className="text-lg font-bold mb-2" htmlFor="expense-date">Expense Date:</Label>
        <Input
          type="date"
          value={newExpenseDate.toISOString().split('T')[0]}
          onChange={(e) => setNewExpenseDate(new Date(e.target.value))}
          className="p-2 border border-gray-300 rounded-lg mb-4"
          id="expense-date"
        />
        
        <Button
          type="button"
          onClick={handleAddExpense}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add Expense
        </Button>
      </form>

      {/* Filter Section */}
      <h2 className="text-2xl font-bold mb-4">Filter Expenses:</h2>
      <form className="flex flex-col mb-4">
        <Label className="text-lg font-bold mb-2" htmlFor="filter-category">Category:</Label>
        <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <SelectTrigger className="w-full p-2 border border-gray-300 rounded-lg mb-4">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label className="text-lg font-bold mb-2" htmlFor="filter-date">Date Range:</Label>
        <div className="flex space-x-4 mb-4">
          <Input
            type="date"
            value={filterDateRange.from}
            onChange={(e) => setFilterDateRange({ ...filterDateRange, from: e.target.value })}
            className="p-2 border border-gray-300 rounded-lg"
          />
          <Input
            type="date"
            value={filterDateRange.to}
            onChange={(e) => setFilterDateRange({ ...filterDateRange, to: e.target.value })}
            className="p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </form>

      {/* Expenses List */}
      <h2 className="text-2xl font-bold mb-4">Expenses:</h2>
      <ul>
        {filteredExpenses.map((expense, index) => (
          <li key={index} className="flex justify-between items-center mb-4">
            <span>{expense.name}</span>
            <span>₹{expense.amount}</span>
            <span>{expense.category}</span>
            <span>{expense.date.toISOString().split('T')[0]}</span>
            <span>{expense.description}</span>
            <Button
              type="button"
              onClick={() => handleRemoveExpense(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>

      {/* Pie Chart Visualization */}
      <canvas id="expenseChart" className="my-8"></canvas>

      {/* Total Expense */}
      <h2 className="text-2xl font-bold mb-2">Total Expense:</h2>
      <p className="text-lg">₹{totalExpense}</p>
    </div>
  );
};

export default ExpenseCalculator;
