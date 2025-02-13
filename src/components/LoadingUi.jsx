export default function LoadingUi({item}) {
    return (
        <div className="col-md-4" key={item}>
      <div className="card mb-4 p-2 placeholder-glow">
        <div className="card-header placeholder col-12"></div>
        <div className="card-body">
          <p className="placeholder col-6"></p>
          <p className="placeholder col-7"></p>
          <p className="placeholder col-5"></p>
          <p className="placeholder col-8"></p>
          
          <div className="row mb-2">
            <button 
              className="card-link btn btn-primary px-4 placeholder col-12" 
              disabled
            ></button>
          </div>
          
          <div className="row">
            <button 
              className="card-link btn btn-danger px-4 placeholder col-12" 
              disabled
            ></button>
          </div>
        </div>
      </div>
    </div>
    )
}