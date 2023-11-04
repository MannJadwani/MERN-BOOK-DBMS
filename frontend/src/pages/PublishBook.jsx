import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import emailjs from '@emailjs/browser';
import readXlsxFile from 'read-excel-file'

const PublishBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [image, setImage] = useState('');
  const[excelFile,setExcelFile] = useState();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/books/${id}`)
    .then((response) => {
        setAuthor(response.data.author);
        setPublishYear(response.data.publishYear)
        setTitle(response.data.title)
        setImage(response.data.image)
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        alert('An error happened. Please Chack console');
        console.log(error);
      });
  }, [])
  


  const List_of_emails = []

  const test=()=>{
    const input = document.getElementById('email-list')
      readXlsxFile(input.files[0]).then(
        (rows)=>{
          for(let i=0;i<rows.length;i++){
            List_of_emails.push({
              name : rows[i][0],
              email : rows[i][1]
            })//emails
            
          }
          console.log(List_of_emails)
        }
      )
    }

  const publish= ()=>{
    setLoading(true)
    for(let i=0;i<List_of_emails.length;i++){
      const data = {
        to_email:List_of_emails[i].email,
        to_name:List_of_emails[i].name,
        title:title,
        Author:author,
        Publish_year:publishYear,
      } 
      emailjs.send('service_ju5tdlu','template_ti9fm0q',data,'JQCFmJ6Bw_B6xvt8l')
      .catch((error) => {
        setLoading(false);
        // alert('An error happened. Please Check console');
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });
    }
      setLoading(false);
      enqueueSnackbar('Book Published successfully', { variant: 'success' });
      navigate('/');
  }

  

  return (
    <div className='p-4'>
      
      <BackButton />
      <h1 className='text-3xl my-4'>Publish Book</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Title</label>
          <input
            type='text'
            value={title}
            // onChange={(e) => setTitle(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Author</label>
          <input
            type='text'
            value={author}
            // onChange={(e) => setAuthor(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Publish Year</label>
          <input
            type='number'
            value={publishYear}
            // onChange={(e) => setPublishYear(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          />
          <label className='text-xl mr-4 text-gray-500'>excel file</label>
          <input type="file" name="email excel"  id='email-list' />

        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={publish}>
          Publish
        </button>
        <button onClick={test}>test</button>
        <p>This page will send the notice to multiple emails that this project has been publish</p>
      </div>
      
    </div>
  )
}

export default PublishBook