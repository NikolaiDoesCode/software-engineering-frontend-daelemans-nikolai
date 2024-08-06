import { StatusMessage} from "@/types";
import classNames from "classnames";

type Props = {
    nameError: string | null,
    statusMessages: StatusMessage[] | null,
}

const StatusMessageList: React.FC<Props> = ({nameError, statusMessages}: Props) => {    
    return (
        <>
            {statusMessages && (
                <div className="row">
                    <ul className="list-none mb-3 w-fit max-w-80">
                        {nameError && <li className=" text-red-800 text-2xl font-bold">{nameError}:</li> }
                        
                        {statusMessages.map(({message,type}, index) =>(
                            <li 
                                key={index} 
                                className={classNames({
                                    "text-red-800 font-bold": type === "error",
                                    "text-green-800 font-bold": type === "success",
                                })}>
                                {message}
                                <br />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
)
}
export default StatusMessageList
