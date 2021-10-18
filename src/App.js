import './App.css';
import {useState,useEffect} from 'react';
import axios from 'axios';

const URL = 'http://localhost/shopping/';

function App() {
  const [items,setItems] = useState([]);
  const [description,setDescription] = useState('');
  const [amount,setAmount] = useState();


  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data)
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  }, [])

  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({description:description,amount:amount})
    axios.post(URL + 'add.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        setItems(items => [...items,response.data]);
        setDescription('');
        setAmount('');
      }).catch (error => {
        alert(error.response.data.error)
      });
  }

  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved);
      }).catch (error => {
        alert(error.response ? error.response.data.error : error);
      });
  }

  return (
    <div className="container">
      <h3>Shopping list</h3>
      <form onSubmit={save}>
        <label>New item</label>
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="type description"/>
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="type amount"/>
        <button>Add</button>
      </form>
      <div id="list">
        {items?.map(item => (
          <div>
          <p key={item.id}>{item.description}</p><p>{item.amount}</p>
           <p>
           <a className="delete" onClick={() => remove(item.id)} href="#">
              Delete
            </a>&nbsp;
          </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
